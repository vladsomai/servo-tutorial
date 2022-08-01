import { MainWindowProps } from "./main-window"


const CommandsProtocol = (props:MainWindowProps) => {
  return (
    <div className="mb-5">
      <p className="text-center mb-5 text-3xl">
        <strong>{props.currentCommandDictionary.CommandString}</strong>
      </p>
      <article className="mb-2 prose prose-slate max-w-full">
        <h4 className="mb-2">
          Description:&nbsp;
          {props.currentCommandDictionary.Description}
        </h4>
        <h4>
          Parameters to each function are only the axis and the payload, the
          rest of the bytes will be automatically deduced from the given
          arguments. This rule will only apply to the tutorial commands and not
          to the raw commands that you can send from the Control Panel
        </h4>

        <p>
          <ul>
            <li>First byte: Represents the targeted axis of the command.</li>
            <li>
              Second byte: Represents the command for the axis (what action
              should the axis do?).
            </li>
            <li>
              Third byte: Represents the length of the payload Payload bytes:
              arguments that will be applied to the command.&nbsp;
              <b>
                Each command has different arguments,&nbsp;in case no arguments
                are needed you must specify the Third byte as 0x00.
              </b>
            </li>
            <li>
              The rest of the bytes will represent the payload / arguments to
              the command from byte no.&nbsp;2, &nbsp;usually each command has
              different parameters so the length byte will differ from chapter
              to chapter. &nbsp;
              <b>
                Do not worry,&nbsp; we will explain what arguments each command
                needs so you can construct your own raw commands.
              </b>
            </li>
          </ul>
        </p>
      </article>
    </div>
  )
}
export default CommandsProtocol
