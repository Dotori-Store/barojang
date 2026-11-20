import { hash, Algorithm } from '@node-rs/argon2'
import { createInterface, emitKeypressEvents } from 'node:readline'

const PASSCODE_COUNT = 3
const MIN_PASSCODE_LENGTH = 12
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
const adminKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !adminKey) {
  console.error([
    'Supabase 관리자 환경변수가 없습니다.',
    '.env.admin.local 파일을 만들고 다음 두 값을 입력해 주세요.',
    '',
    'SUPABASE_URL=https://<project-ref>.supabase.co',
    'SUPABASE_SECRET_KEY=<sb_secret_로 시작하는 키>',
    '',
    '이 파일은 Git에 포함되지 않습니다.',
  ].join('\n'))
  process.exit(1)
}

const prompt = createInterface({ input: process.stdin, output: process.stdout })

function ask(question) {
  return new Promise((resolve) => prompt.question(question, (answer) => resolve(answer.trim())))
}

function askHidden(question) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
    throw new Error('초대코드는 일반 터미널에서 입력해 주세요.')
  }

  return new Promise((resolve, reject) => {
    let value = ''

    prompt.pause()
    process.stdout.write(question)
    emitKeypressEvents(process.stdin)
    process.stdin.setRawMode(true)
    process.stdin.resume()

    const finish = () => {
      process.stdin.off('keypress', onKeypress)
      process.stdin.setRawMode(false)
      process.stdin.pause()
      process.stdout.write('\n')
      prompt.resume()
    }

    const onKeypress = (character, key = {}) => {
      if (key.ctrl && key.name === 'c') {
        finish()
        reject(new Error('등록을 취소했습니다.'))
        return
      }

      if (key.name === 'return' || key.name === 'enter') {
        finish()
        resolve(value)
        return
      }

      if (key.name === 'backspace') {
        if (value.length > 0) {
          value = value.slice(0, -1)
          process.stdout.write('\b \b')
        }
        return
      }

      if (character && !key.ctrl && !key.meta) {
        value += character
        process.stdout.write('*')
      }
    }

    process.stdin.on('keypress', onKeypress)
  })
}

function validateUserId(userId) {
  return /^[a-z0-9][a-z0-9_-]{2,49}$/.test(userId)
}

async function collectPasscodes() {
  const entries = []

  console.log(`\n초대코드 ${PASSCODE_COUNT}개를 등록합니다.`)
  console.log('코드 원문은 화면이나 파일에 저장되지 않습니다.\n')

  for (let index = 0; index < PASSCODE_COUNT; index += 1) {
    console.log(`[${index + 1}/${PASSCODE_COUNT}]`)

    let userId = ''
    while (!validateUserId(userId) || entries.some((entry) => entry.user_id === userId)) {
      userId = await ask('사용자 ID (영문 소문자, 숫자, -, _): ')
      if (!validateUserId(userId)) {
        console.log('3~50자의 영문 소문자, 숫자, -, _만 사용할 수 있습니다.')
      } else if (entries.some((entry) => entry.user_id === userId)) {
        console.log('이미 입력한 사용자 ID입니다.')
      }
    }

    let passcode = ''
    let confirmation = ''
    do {
      passcode = await askHidden(`초대코드 (${MIN_PASSCODE_LENGTH}자 이상): `)
      if (passcode.length < MIN_PASSCODE_LENGTH) {
        console.log(`초대코드는 ${MIN_PASSCODE_LENGTH}자 이상이어야 합니다.`)
        continue
      }

      confirmation = await askHidden('초대코드 확인: ')
      if (passcode !== confirmation) {
        console.log('두 초대코드가 일치하지 않습니다.')
      }
    } while (passcode.length < MIN_PASSCODE_LENGTH || passcode !== confirmation)

    const passcodeHash = await hash(passcode, {
      algorithm: Algorithm.Argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
      outputLen: 32,
    })

    entries.push({ user_id: userId, passcode_hash: passcodeHash })
    passcode = ''
    confirmation = ''
    console.log(`${userId}의 해시를 만들었습니다.\n`)
  }

  return entries
}

async function savePasscodes(entries) {
  const headers = {
    apikey: adminKey,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=minimal',
  }

  if (!adminKey.startsWith('sb_secret_')) {
    headers.Authorization = `Bearer ${adminKey}`
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/access_codes?on_conflict=user_id`, {
    method: 'POST',
    headers,
    body: JSON.stringify(entries),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Supabase 등록 실패 (${response.status}): ${message}`)
  }
}

try {
  const entries = await collectPasscodes()
  const answer = await ask(`사용자 ID ${entries.map((entry) => entry.user_id).join(', ')}를 등록할까요? (y/n): `)
  const approved = ['y', 'yes'].includes(answer.toLowerCase())

  if (!approved) {
    console.log('등록하지 않고 종료했습니다.')
    process.exitCode = 0
  } else {
    await savePasscodes(entries)
    console.log('\n초대코드 3개의 Argon2id 해시를 Supabase에 등록했습니다.')
  }
} catch (error) {
  console.error(`\n${error.message}`)
  process.exitCode = 1
} finally {
  prompt.close()
}
