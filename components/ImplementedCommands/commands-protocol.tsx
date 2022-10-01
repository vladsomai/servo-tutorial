import { MainWindowProps } from '../main-window'

const CommandsProtocol = (props: MainWindowProps) => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className="w-8/12">
        <article className="mb-5 prose prose-slate max-w-full">
          <div className="flex justify-center">
            <h2>{props.currentCommandDictionary.CommandString}</h2>
          </div>
          <h4 className="mb-2">
            Description:&nbsp;
            {props.currentCommandDictionary.Description}
          </h4>
          <h4>
            Parameters to each command are only the axis and the payload, the
            command byte will be automatically deduced from the chapter displayed on the screen.
            <br></br>
            The length byte is calculated at the end, right before the command is beeing sent to the motor.
          </h4>

          <h3>Send protocol:</h3>
          <ul>
            <li>First byte: Represents the targeted axis of the command.</li>
            <li>
              Second byte: Represents the command for the axis (what action
              should the axis do?).
            </li>
            <li>
              Third byte: Represents the length of the payload / arguments
              bytes. They represent paramters that are being passed to the
              command.&nbsp;
              <b>
                Each command has different parameters,&nbsp;in case no
                parameters are needed you must specify the Third byte as 0x00.
              </b>
            </li>
            <li>
              The rest of the bytes will represent the payload / arguments to
              the command described at byte no.&nbsp;2, &nbsp;usually each
              command has different parameters so the length byte will differ
              from chapter to chapter. &nbsp;
              <b>
                Do not worry,&nbsp; we will explain what arguments each command
                needs so you can construct your own raw commands.
              </b>
            </li>
          </ul>
          <h3>Receive protocol:</h3>
          <ul>
            <li>First byte: Represents a reserved axis byte for the receive commands. This byte is currently set to ASCII &quot;R&quot;.</li>
            <li>
              Second byte: Represents the status of the sent command.
              <br></br>
              0 indicates success, no payload shall be received.
              <br></br>
              1 indicates there are one or more parameters received.
            </li>
            <li>
              Third byte: Represents the length of the payload
              bytes. Each command has different response payloads.
            </li>
            <li>
              The rest of the bytes will represent the payload the command responded with.
            </li>
          </ul>
        </article>
        <article className="mb-10 prose prose-slate max-w-full">
          <div className="flex justify-center">
            <h2>Understanding the servomotor units</h2>
          </div>
          <h3>Time</h3>
          <ul>
            <li>
              <strong>Timesteps</strong> are the internal unit used for time in
              movement commands.
              <br></br>
              One timestep is equivalent to <strong>32 microseconds</strong>.
            </li>
            <li>
              The SI unit for time is the <strong>second</strong>.
            </li>
            <li>
              The conversion is as follows:
              <br></br>
              timesteps_internal = time_standard * 1000000 / 32
              <br></br>
              Example: 1 second = 31250 timesteps
              <br></br>
            </li>{' '}
          </ul>
          <h3>Position</h3>
          <ul>
            <li>
              Position is better described as the{' '}
              <strong>angular position or just angle</strong>
            </li>
            <li>
              The internal unit is called <strong>microstep</strong>. There are
              645120 microsteps in one shaft rotation. This can be positive or
              negative.
            </li>
            <li>
              The SI unit for an angle is the <strong>radian</strong>.<br></br>
              Another well known unit is the{' '}
              <strong>rotation / revolution</strong>.
            </li>
            <li>
              The conversion is as follows:
              <br></br>
              position_internal = position_radians / 2 / PI * 645120
              <br></br>
              position_internal = position_rotations * 645120
              <br></br>
              Example: 0.5 rotations = 322560 microsteps
            </li>
          </ul>

          <h3>Velocity</h3>
          <ul>
            <li>
              Velocity is better described as the
              <strong> angular velocity</strong>
            </li>
            <li>
              The internal unit for velocity can be understood as the number of
              <strong> microsteps per one timestep </strong>
              while keeping 32 fractional bits. Velocity can be positive or
              negative.
            </li>

            <li>
              The SI unit is <strong>radians per second</strong>.<br></br> Other
              well known units for velocity are{' '}
              <strong>rotations per second</strong> and{' '}
              <strong>rotations per minute (RPM)</strong>.
            </li>
            <li>
              When sending the velocity using the command protocol, we need to
              send the velocity in <strong> communication units</strong> and the
              motor will self convert it to internal units.
            </li>

            <li>
              The conversion is as follows:
              <br></br>
              velocity_internal = velocity_radians_per_second / 2 / PI * 645120
              / 31250 * 2^32
              <br></br>
              velocity_internal = velocity_rotations_per_second * 645120 / 31250
              * 2^32
              <br></br>
              velocity_internal = velocity_rotations_per_minute / 60 * 645120 /
              31250 * 2^32
              <br></br>
              velocity_communication = velocity_internal / 2^12
              <br></br>
              Example: 2000 RPM = 33.3333 rotations per second =
              2955487255461.88 internal units = 721554506 to be sent
              (communications units)
            </li>
          </ul>

          <h3>Acceleration</h3>
          <ul>
            <li>
              Acceleration is better described as
              <strong> angular acceleration.</strong>
            </li>

            <li>
              The internal unit for acceleration can be understood as the
              <strong> velocity change per one timestep</strong> where the
              velocity is the internal velocity.
              <br></br>
              The acceleration is stored in a 32-bit signed integer.
            </li>

            <li>
              The SI unit is <strong> radians per second squared</strong>.
              <br></br>
              Other well known units are{' '}
              <strong>rotations per second squared</strong> and{' '}
              <strong> rotations per minute squared</strong>.
            </li>

            <li>
              When sending an acceleration using the command protocol, we need
              to send the acceleration in <strong> communication units</strong>{' '}
              and the motor will self convert it to internal units.
            </li>

            <li>
              The conversions are as follows:
              <br></br>
              acceleration_internal = acceleration_radians_per_second_squared /
              2 / PI * 645120 / 31250^2 * 2^32
              <br></br>
              acceleration_internal = acceleration_rotations_per_second_squared
              * 645120 / 31250^2 * 2^32
              <br></br>
              acceleration_internal = acceleration_rotations_per_minute_squared
              / 60^2 * 645120 / 31250^2 * 2^32
              <br></br>
              acceleration_communication = acceleration_internal / 2^8
            </li>
          </ul>
        </article>
      </div>
    </div>
  )
}
export default CommandsProtocol
