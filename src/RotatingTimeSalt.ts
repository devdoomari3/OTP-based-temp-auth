import * as crypto from 'crypto'

export type UnixTimestampMin = number & {
  __UnixTimestampMin: null,
}

export type TimeSliceMinute = UnixTimestampMin & {
  __TimeSlice: null,
}

export const getCurrentTimestampMin = () => (Date.now() / 60 / 1000) as UnixTimestampMin

export function getRandomSecureString(bytes: number = 32) {
  return new Promise<string>((resolve, reject) => {
    crypto.randomBytes(bytes, (err, buffer) => {
      if (err) {
        reject(err)
        return
      }
      resolve(buffer.toString('hex'))
    })
  })
}

export class RotatingTimeSalt {
  timeSliceMinuteInterval: number
  slicesExpiration: number // interval * expiration count --> min of expiration

  constructor(args: {
    timeSliceMinuteInterval?: number,
    slicesExpiration?: number,
  } = {}) {
    this.timeSliceMinuteInterval = args.timeSliceMinuteInterval || 5
    this.slicesExpiration = args.slicesExpiration || 3
  }

  rotatingTimeSalts: {
    timeSlice: TimeSliceMinute,
    salt: Promise<string>,
  }[] = []

  resetCounter = 0

  getUTCTimeSlice(currentTimeStampMin: UnixTimestampMin = getCurrentTimestampMin()) {
    return (
      currentTimeStampMin - (currentTimeStampMin % this.timeSliceMinuteInterval)
    ) as TimeSliceMinute
  }

  getCurrent(currentTimeStampMin: UnixTimestampMin = getCurrentTimestampMin()) {
    const timeSlice = this.getUTCTimeSlice(currentTimeStampMin)
    const lastSalt = this.rotatingTimeSalts[this.rotatingTimeSalts.length - 1]
    if (lastSalt && lastSalt.timeSlice >= timeSlice) { return lastSalt }
    if (this.resetCounter > this.slicesExpiration) {
      const minTimeSlice = this.getMinTimeSlice(timeSlice)
      const numRotatingSaltToRemove = this.rotatingTimeSalts.findIndex(a => a.timeSlice >= minTimeSlice) - 1
      this.rotatingTimeSalts.splice(0, numRotatingSaltToRemove)
      this.resetCounter = 0
    }
    else {
      this.resetCounter++
    }
    const salt = getRandomSecureString(32)
    this.rotatingTimeSalts.push({
      timeSlice,
      salt,
    })
    return {
      timeSlice,
      salt,
    }
  }
  getMinTimeSlice(currentTimeSlice: TimeSliceMinute) {
    return (
      currentTimeSlice - (this.timeSliceMinuteInterval * this.slicesExpiration)
    ) as TimeSliceMinute
  }
}