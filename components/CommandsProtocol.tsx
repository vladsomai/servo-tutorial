import { MainWindowProps } from './main-window'

const CommandsProtocol = (props: MainWindowProps) => {
  return (
    <div className="">
      <article className="mb-5 prose prose-slate max-w-full">
        <div className="flex justify-center">
          <h2>{props.currentCommandDictionary.CommandString}</h2>
        </div>
        <h4 className="mb-2">
          Description:&nbsp;
          {props.currentCommandDictionary.Description}
        </h4>
        <h4>
          Parameters to each function are only the axis and the payload, the
          rest of the bytes will be automatically deduced from the given
          arguments. This rule will only apply to the tutorial commands and not
          to the raw commands that you can send from the Control Panel.
        </h4>
        <ul>
          <li>First byte: Represents the targeted axis of the command.</li>
          <li>
            Second byte: Represents the command for the axis (what action should
            the axis do?).
          </li>
          <li>
            Third byte: Represents the length of the payload / arguments bytes.
            They represent paramters that are being passed to the command.&nbsp;
            <b>
              Each command has different parameters,&nbsp;in case no parameters
              are needed you must specify the Third byte as 0x00.
            </b>
          </li>
          <li>
            The rest of the bytes will represent the payload / arguments to the
            command described at byte no.&nbsp;2, &nbsp;usually each command has
            different parameters so the length byte will differ from chapter to
            chapter. &nbsp;
            <b>
              Do not worry,&nbsp; we will explain what arguments each command
              needs so you can construct your own raw commands.
            </b>
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
            The standard unit is the <strong>radian</strong>.<br></br>
            Another well known unit is the <strong>rotation</strong>.
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
      </article>
    </div>
  )
}
export default CommandsProtocol
