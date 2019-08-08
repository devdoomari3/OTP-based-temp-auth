import {
  RotatingTimeSalt,
  UnixTimestampMin,
} from '../RotatingTimeSalt'

describe('RotatingTimeSalt should...', () => {
  it('should test ok', async () => {
    const rotatingTimeSalt = new RotatingTimeSalt({
      timeSliceMinuteInterval: 2,
      slicesExpiration: 2,
    })
  
    rotatingTimeSalt.getCurrent(1 as UnixTimestampMin)
    rotatingTimeSalt.getCurrent(2 as UnixTimestampMin)
    rotatingTimeSalt.getCurrent(5 as UnixTimestampMin)
  
    console.log('A1', rotatingTimeSalt.rotatingTimeSalts)
  
    expect(rotatingTimeSalt.rotatingTimeSalts.length).toBeLessThanOrEqual(3)
  
    rotatingTimeSalt.getCurrent(7 as UnixTimestampMin)
  
    console.log('A2', rotatingTimeSalt.rotatingTimeSalts)
    rotatingTimeSalt.getCurrent(10 as UnixTimestampMin)
  
    rotatingTimeSalt.getCurrent(8 as UnixTimestampMin)
  
    rotatingTimeSalt.getCurrent(11 as UnixTimestampMin)
  
    rotatingTimeSalt.getCurrent(15 as UnixTimestampMin)
  
    rotatingTimeSalt.getCurrent(17 as UnixTimestampMin)
  
    rotatingTimeSalt.getCurrent(20 as UnixTimestampMin)
  
    console.log('A3', rotatingTimeSalt.rotatingTimeSalts)
  
    expect(rotatingTimeSalt.rotatingTimeSalts.length).toBeLessThanOrEqual(3)
  })  
})
