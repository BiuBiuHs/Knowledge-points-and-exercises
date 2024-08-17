
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/*
interface Laziness {
  sleep: (time: number) => Laziness
  sleepFirst: (time: number) => Laziness
  eat: (food: string) => Laziness
}
*/

/**
 * @param {string} name
 * @param {(log: string) => void} logFn
 * @returns {Laziness}
 */
function LazyMan(name, logFn) {
  const cmds = [['greet', name]]

  const actions = {
    greet: name => logFn(`Hi, I'm ${name}.`),
    eat: food => logFn(`Eat ${food}.`),
    sleep: ms => sleep(ms * 1000).then(() => logFn(`Wake up after ${ms} second${ms > 1 ? 's' : ''}.`)),
  }

  Promise.resolve().then(exec)

  async function exec() {
    for (const [cmd, val] of cmds) {
      await actions[cmd](val)
    }
  }

  return {
    sleep(ms) {
      cmds.push(['sleep', ms])
      return this
    },
    sleepFirst(ms) {
      cmds.unshift(['sleep', ms])
      return this
    },
    eat(food) {
      cmds.push(['eat', food])
      return this
    },
  }
}