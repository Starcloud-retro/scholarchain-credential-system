import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

function resolveRolldownBindingMode() {
	if (process.env.NAPI_RS_FORCE_WASI) return process.env.NAPI_RS_FORCE_WASI

	try {
		require.resolve('@rolldown/binding-wasm32-wasi')
		return '1'
	} catch {
		return undefined
	}
}

const command = process.platform === 'win32' ? 'cmd.exe' : 'npx'
const args =
	process.platform === 'win32'
		? ['/d', '/s', '/c', 'npx vite build --configLoader runner']
		: ['vite', 'build', '--configLoader', 'runner']

const child = spawn(command, args, {
	env: {
		...process.env,
		NAPI_RS_FORCE_WASI: resolveRolldownBindingMode(),
	},
	stdio: 'inherit',
})

child.on('exit', (code) => {
	process.exit(code ?? 1)
})
