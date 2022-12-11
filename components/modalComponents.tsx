export const ResetCmd = (
  <ul className="">
    <li>
      <kbd className="kbd text-neutral-content">ctrl</kbd>+
      <kbd className="kbd text-neutral-content">r</kbd>
      <p className="inline"> to reset the current selected axis</p>
    </li>
    <li>
      <kbd className="kbd text-neutral-content">ctrl</kbd>+
      <kbd className="kbd text-neutral-content">R</kbd>
      <p className="inline"> to reset all axes</p>
    </li>
  </ul>
)
export const EnableCmd = (
  <ul className="">
    <li>
      <kbd className="kbd text-neutral-content">ctrl</kbd>+
      <kbd className="kbd text-neutral-content">e</kbd>
      <p className="inline"> to enable MOSFETs for the current selected axis</p>
    </li>
    <li>
      <kbd className="kbd text-neutral-content">ctrl</kbd>+
      <kbd className="kbd text-neutral-content">E</kbd>
      <p className="inline"> to enable MOSFETs on all axes</p>
    </li>
  </ul>
)
export const DisableCmd = (
  <ul className="">
    <li>
      <kbd className="kbd text-neutral-content">ctrl</kbd>+
      <kbd className="kbd text-neutral-content">d</kbd>
      <p className="inline">
        {' '}
        to disable MOSFETs for the current selected axis
      </p>
    </li>
    <li>
      <kbd className="kbd text-neutral-content">ctrl</kbd>+
      <kbd className="kbd text-neutral-content">D</kbd>
      <p className="inline"> to disable MOSFETs on all axes</p>
    </li>
  </ul>
)

export const troubleshootConnection = (
  <>
    <article className="mb-5 prose prose-lg max-w-full spacin tracking-wide">
      <p className="text-xl mt-10">
        Please verify each of the following is true:
      </p>
      <ol className="">
        <li>You are connected to the serial port.</li>
        <li>You selected the correct axis.</li>
        <li>The motor is powered on.</li>
        <li>The motor is connected to the USB port.</li>
      </ol>
      <p>
        In case none of the above solve the issue, please contact your
        administrator.
      </p>
    </article>
  </>
)
export const troubleshootIncompleteResponse = (
  <>
    <article className="mb-5 prose prose-lg max-w-full spacin tracking-wide">
      <p>This usually happens when the command is not fully supported.</p>
      <p>You can try solving the issue using one of the following steps:</p>
      <ol className="">
        <li>Resetting the motor with the system reset command</li>
        <li>Clear the log window</li>
        <li>Refresh the page</li>
      </ol>
      <p>
        In case none of the above solve the issue, please contact your
        administrator.
      </p>
    </article>
  </>
)
