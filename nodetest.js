const Logger = require('.')
Logger.log('this is a log', 1, {}, [])
Logger.warn('this is a warn', 1, {}, [])
Logger.error('this is a error', 1, {}, [])
Logger.config.timeStamp = () => new Date().toString()
Logger.log('this is a log', 1, {}, [])
Logger.warn('this is a warn', 1, {}, [])
Logger.error('this is a error', 1, {}, [])
Logger.disable()
Logger.log('this is a log', 1, {}, [])
Logger.warn('this is a warn', 1, {}, [])
Logger.error('this is a error', 1, {}, [])
Logger.config.timeStamp = () => new Date().toString() + 'BOOYAH'
Logger.log('this is a log', 1, {}, [])
Logger.warn('this is a warn', 1, {}, [])
Logger.enable()
Logger.error('this is a error', 1, {}, [])
