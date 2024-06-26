import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { animated, useSpring } from "react-spring";
import { Command31 } from "../31/31";
import { ChaptersPropsType } from "../0_1/0_1";
import SelectAxis, { SelectAxisPropsType } from "../../select-axis";
import { CommandWindowProps } from "../../command-window";
import { Command20 } from "../20/20";
import { Command21 } from "../21/21";
import { Command2 } from "../2/2";
import { useContext } from "react";
import { GlobalContext } from "../../../pages/_app";
import { Command41 } from "../41/41";

export interface TutorialProps
    extends CommandWindowProps,
        ChaptersPropsType,
        SelectAxisPropsType {}

function Tutorial(props: TutorialProps) {
    const globalContext = useContext(GlobalContext);

    const [styleSpring] = useSpring(
        () => ({
            from: { opacity: 0 },
            to: { opacity: 1 },
            config: { duration: 1000 },
        }),
        []
    );

    return (
        <>
            <Head>
                <title>Quick start | Gearotons</title>
            </Head>
            <animated.div
                className="flex flex-col justify-center items-center mt-16"
                style={styleSpring}
            >
                <div className="">
                    <article className="mb-5 prose prose-slate max-w-full">
                        <h2 className="mb-2">Prerequisites</h2>
                        <p>
                            In order to follow this tutorial you will need the
                            following:
                        </p>
                        <ol>
                            <li>Gearotons Servo motor</li>
                            <li>12V to 24V Power supply</li>
                            <li>USB to RS-485 adapter</li>
                            <li>
                                Wires to connect the motor to the power supply
                                and RS-485 adapter
                            </li>
                        </ol>
                        <h2 className="mb-2">Powering the motor on</h2>
                        <p>
                            The motor has two markings with the positive(+) and
                            negative(-) pins (you can check the exact location
                            of those pins on our &nbsp;
                            <button
                                className="underline"
                                title="3D Model"
                                onClick={() => {
                                    window.open(
                                        "/",
                                        "_blank",
                                        "noopener,noreferrer"
                                    );
                                }}
                            >
                                3D model
                            </button>
                            &nbsp; from the home page), those pins will have two
                            wires that need to be connected to a 12V to 24V
                            power supply.
                            <br />
                            When the motor is powered on, a green or red LED
                            flashes.
                        </p>
                        <ol>
                            <li>
                                Green LED flashing slowly: the MCU is currently
                                operating in its main loop, waiting for a
                                command from the user.
                            </li>
                            <li>
                                Green LED flashing fast: MCU is in the
                                bootloader, it will not accept any commands.
                            </li>
                            <li>
                                Red LED flashing: the MCU has an error, it will
                                not accept any commands.
                            </li>
                        </ol>
                        <p>
                            When the motor is in a state identical to points 2
                            and 3 from above, you should send a reset command.
                            For now, you can reset the motor by pressing the
                            reset button. Check out its exact location on our
                            &nbsp;
                            <button
                                className="underline"
                                title="3D Model"
                                onClick={() => {
                                    window.open(
                                        "/",
                                        "_blank",
                                        "noopener,noreferrer"
                                    );
                                }}
                            >
                                3D model
                            </button>
                            .
                        </p>
                        <h4>Verify the motor spins</h4>
                        <p>
                            After you power on the motor and the green LED
                            flashes slowly, you can press the rotate button to
                            make sure everything works as expected at this
                            point.
                        </p>
                        <ol>
                            <li>
                                Pressing the rotate button quickly should rotate
                                the motor for 2 seconds in one direction.
                            </li>
                            <li>
                                Pressing and releasing after 0.5 seconds, should
                                rotate the motor for 2 seconds in the other
                                direction.
                            </li>
                            <li>
                                Pressing and releasing after 3 seconds will
                                cause the motor to go into closed loop control
                                mode.
                            </li>
                            <li>
                                Pressing and releasing after 15 seconds will
                                cause the motor to perform a self calibration.
                                Make sure that there is nothing connected to the
                                shaft.
                                <br />
                                <p className="font-extrabold text-warning inline">
                                    CAUTION:{" "}
                                </p>
                                The motor will spin several times back and forth
                                during the calibration.
                            </li>
                        </ol>
                        <h2 className="mb-2">Connecting to the motor</h2>
                        <p>
                            The motor has 4 RS-485 pins, marked with B A B A on
                            the PCBA(check the exact location using the &nbsp;
                            <button
                                className="underline"
                                title="3D Model"
                                onClick={() => {
                                    window.open(
                                        "/",
                                        "_blank",
                                        "noopener,noreferrer"
                                    );
                                }}
                            >
                                3D model
                            </button>
                            &nbsp;), we will only use one pair of B A for now.
                            Using some wires, physically connect the B A pins
                            from the motor to the B A pins of the RS-485 adapter
                            as shown in the figure below.
                        </p>
                        <div className="w-full flex justify-center">
                            <Image
                                className="w-[600px] h-auto"
                                loading="eager"
                                src={"/motor-to-rs485.png"}
                                sizes="100vw"
                                width={0}
                                height={0}
                                alt="motor to rs-485 wiring"
                            ></Image>
                        </div>
                        <h4>Driver installation</h4>
                        <p>
                            The RS-485 adapter requires its driver software,
                            installation steps differ based on the manufacturer,
                            some require explicit installation(the driver must
                            be downloaded manually from the manufacturer&apos;s
                            website), and some of them are installed
                            automatically when plugged in. We advise you to do
                            your own research on how to accomplish this step
                            based on the product you own.
                        </p>
                        <h4>Verify the connection</h4>
                        <p>
                            At this point, the motor is physically connected to
                            the RS-485 adapter and the RS-485 adapter is plugged
                            into your PC.
                        </p>
                        <p>
                            The motor is powered on and the green LED flashes
                            slowly.
                        </p>
                        <ol>
                            <li>
                                Click on the red button from the Log Window to
                                display the available COM ports.
                            </li>
                            <li>
                                Select the COM port that targets your motor and
                                click &apos;Connect&apos;. In case you
                                don&apos;t see any COM port available, your
                                driver is not installed correctly.
                            </li>
                            <li>
                                You should see a confirmation message in the Log
                                Window whether the connection was successful or
                                not.{" "}
                            </li>
                            <li>Make sure CAPS-LOCK is active.</li>
                            <li className="mt-2">
                                <p className="inline">Press </p>
                                <kbd className="kbd text-neutral-content">
                                    ctrl
                                </kbd>
                                +
                                <kbd className="kbd text-neutral-content">
                                    R
                                </kbd>
                                <p className="inline"> to reset the motor.</p>
                            </li>
                            <li>
                                The motor&apos;s LED should flash fast for 0.5s
                                and then start flashing slowly. This means you
                                successfully reset the motor and the
                                communication between your PC and the motor is
                                established.
                            </li>
                            <li>
                                The Log Window should contanin a hexadecimal
                                representation of the bytes sent over the serial
                                lines to the servo motor. The reset command we
                                just sent using the reset command shortcut is 0x
                                FF 1B 00.
                            </li>
                        </ol>
                        <h2>Log Window</h2>
                        <p>
                            The log window is tailored to make our clients have
                            a better user experience, you can click on the sent
                            and received bytes in the Log Window to quickly
                            understand what each byte means. Some received bytes
                            are dynamically converted to ASCII, decimal, or
                            strings to quickly translate the hexadecimal to
                            something more human-understandable.
                            <br />
                        </p>
                        <p className="font-extrabold text-warning inline">
                            Note:{" "}
                        </p>
                        <p className="inline">
                            The Log Window always displays data in little-endian
                            format. That&apos;s the format we use to send and
                            receive data.
                        </p>
                        <p>The Log Window header contains 5 buttons:</p>
                        <ol>
                            <li>
                                Connect/Disconnect: informs the user whether
                                he/she is currently connected to the servo
                                motor.
                                <br /> When this button is green, you can send
                                commands.
                                <br /> When the button is red, you must connect
                                to send any commands.
                            </li>
                            <li>
                                DISABLE FETS: disables the MOSFETs transistors.
                                Those transistors are used to control whether
                                the motor itself can receive current. <br />
                                <p className="font-extrabold text-warning inline">
                                    Note:{" "}
                                </p>
                                The motor has the MOSFETs disabled by default
                                when your power it on or after issuing a system
                                reset command.
                            </li>
                            <li>
                                ENABLE FETS: enables the MOSFETs transistors.
                                Before issuing any movement command, the MOSFETs
                                must be enabled for the motor to spin.
                                <br />
                                <p className="font-extrabold text-warning inline">
                                    Note:{" "}
                                </p>
                                When you press the physical rotate button from
                                the PCBA, the MOSFETs will be enabled by the
                                firmware and it will remain enabled until power
                                off or system reset.
                            </li>
                            <li>
                                GET STATUS: Sends the command that receives the
                                current status of the motor. <br />
                                e.g. In case the red LED from the motor flashes,
                                you can press this button to read what is the
                                current state by clicking on the received output
                                bytes, thus helping you diagnose issues faster
                                or understand what happened.
                                <br />
                                Read more about the GET STATUS command{" "}
                                <Link href="/docs/16">here</Link>.
                            </li>
                            <li>
                                RESET: press this button to reset the current
                                axis / alias.
                            </li>
                            <li>
                                CLEAR: press this button to clear the Log
                                Window.
                            </li>
                        </ol>
                        <p className="font-extrabold text-warning inline">
                            Note:{" "}
                        </p>
                        <p className="inline">
                            When you press DISABLE/ENABLE FETS or GET STATUS
                            buttons, the actual command is sent to the currently
                            selected alias, learn more about alias in the next
                            section.
                            <br /> When you navigate on our site, we preserve
                            the state of the alias you selected.
                        </p>
                        <hr></hr>
                        <h2>Find out your device alias</h2>
                        <p>
                            Before you can use the docs to test supported
                            commands, you must know or set your motor&apos;s
                            alias.
                            <br />
                            The alias is simply a number ranging from 0 to 253
                            that you can set to identify your motor. Out of the
                            factory, the motor&apos;s alias will not be set to
                            anything.
                        </p>
                        <p>
                            Let&apos;s execute the DETECT DEVICES command with
                            the alias input box set to &apos;255&apos;. That
                            means we will send the detect devices command to all
                            devices connected to the serial port. All connected
                            motors will respond with their unique id, current
                            alias, and a CRC32 payload.
                            <br />
                            For your convenience, devices will be listed right
                            here if they are successfully detected.
                        </p>
                        <Command20
                            MountedByQuickStart={true}
                            {...props}
                            getAxisSelection={props.getAxisSelection}
                            sendDataToSerialPort={props.sendDataToSerialPort}
                            LogAction={props.LogAction}
                            constructCommand={props.constructCommand}
                        >
                            <SelectAxis
                                LogAction={props.LogAction}
                                axisSelectionValue={props.axisSelectionValue}
                                setAxisSelectionValue={
                                    props.setAxisSelectionValue
                                }
                            />
                        </Command20>
                        {globalContext.detectedDevices.Devices.map(
                            (item, index) => (
                                <div
                                    className="flex items-center justify-start"
                                    key={index}
                                >
                                    <div className="w-[85%] 2xl:w-[65%]">
                                        <Command21
                                            MountedByQuickStart={true}
                                            UniqueID={item.UniqueID}
                                            Alias={item.Alias}
                                            key={index}
                                            {...props}
                                            getAxisSelection={
                                                props.getAxisSelection
                                            }
                                            sendDataToSerialPort={
                                                props.sendDataToSerialPort
                                            }
                                            LogAction={props.LogAction}
                                            constructCommand={
                                                props.constructCommand
                                            }
                                        >
                                            <SelectAxis
                                                key={index}
                                                LogAction={props.LogAction}
                                                axisSelectionValue={
                                                    props.axisSelectionValue
                                                }
                                                setAxisSelectionValue={
                                                    props.setAxisSelectionValue
                                                }
                                            />
                                        </Command21>
                                    </div>
                                    <div className="">
                                        <Command41
                                            MountedByQuickStart={true}
                                            UniqueID={item.UniqueID}
                                            key={index}
                                            {...props}
                                            getAxisSelection={
                                                props.getAxisSelection
                                            }
                                            sendDataToSerialPort={
                                                props.sendDataToSerialPort
                                            }
                                            LogAction={props.LogAction}
                                            constructCommand={
                                                props.constructCommand
                                            }
                                        >
                                            <SelectAxis
                                                LogAction={props.LogAction}
                                                axisSelectionValue={
                                                    props.axisSelectionValue
                                                }
                                                setAxisSelectionValue={
                                                    props.setAxisSelectionValue
                                                }
                                            />
                                        </Command41>
                                    </div>
                                </div>
                            )
                        )}
                        <hr />
                        <h2>Identify your device</h2>
                        <p>
                            Using the &quot;Detect devices&quot; command you
                            were able to find out your motor&apos;s Unique ID
                            and the current alias.
                        </p>
                        <p>
                            By sending the Identify command, you can identify
                            each motor by its unique ID. The motor will flash
                            its green LED rapidly for 3 seconds. The command
                            must be sent using the Unique ID of the motor you
                            want to identify, allowing you to set a particular
                            alias for that motor afterward. This command is
                            helpful in case you have multiple motors in a daisy
                            chain and you want to name them differently.
                        </p>
                        <h2>Set device alias</h2>
                        <div className="my-5">
                            <p>
                                The &quot;Alias&quot; of your motor was replied
                                by &quot;Detect devices&quot;. You can change
                                the alias using the input box above and then
                                clicking &quot;Set Alias&quot;. The motor will
                                remember this alias through power cycles. You
                                can set a new alias to a valid ASCII character
                                (examples: A, B, P, l, d) or you can set the
                                alias to any decimal value between 0 and 253.
                            </p>
                            <p className="font-extrabold text-warning mb-0 pb-0">
                                Note:
                            </p>
                            <ul className="my-0">
                                <li className="my-0">
                                    <p className="my-0">
                                        Alias 254 is reserved for response
                                        messages and cannot be used.
                                    </p>
                                </li>
                                <li className="my-0">
                                    <p className="my-0">
                                        Alias 255 is reserved for sending a
                                        command to all connected aliases and
                                        cannot be used. When you want to use
                                        multiple motors in a chain, sending a
                                        command with the 255 alias will send
                                        that command to all devices chained
                                        together.
                                    </p>
                                </li>
                                <li className="my-0">
                                    <p className="my-0">
                                        If you want to set the new alias to a
                                        decimal value ranging from &quot;0&quot;
                                        to &quot;9&quot; you must specify it as
                                        &quot;00&quot; or &quot;09&quot;
                                        Otherwise it will be considered an ASCII
                                        character.
                                    </p>
                                </li>
                            </ul>
                        </div>

                        <hr />
                        <h2>Ping your alias</h2>
                        <p>
                            You can send some arbitrary data (10 characters
                            long) to the motor using the PING COMMAND, it shall
                            reply exactly the same data you sent.
                            <br />
                            Make sure to use the right alias of your device that
                            you set above.
                        </p>
                        <Command31
                            {...props}
                            getAxisSelection={props.getAxisSelection}
                            sendDataToSerialPort={props.sendDataToSerialPort}
                            LogAction={props.LogAction}
                            constructCommand={props.constructCommand}
                        >
                            <SelectAxis
                                LogAction={props.LogAction}
                                axisSelectionValue={props.axisSelectionValue}
                                setAxisSelectionValue={
                                    props.setAxisSelectionValue
                                }
                            />
                        </Command31>
                        <hr />
                        <h2>Custom motor movement</h2>
                        <p>
                            All good you may say, but our main scope is to make
                            some metal spin. Let&apos;s see how we can
                            accomplish that together.
                        </p>
                        <p>
                            Using the TRAPEZOID MOVE command, we can make the
                            motor spin in one direction by setting the position
                            to a positive value or spin it the other way by
                            setting the position to a negative value.
                        </p>
                        <ol>
                            <li>
                                Gearotons offers 2 motor types: M1 and M3. If
                                you do not know your motor type, you can use the
                                autodetect feature. This step is required as
                                different motor types have different steps per
                                revolution. Set the motor type to
                                &ldquo;Unknown&ldquo; and press the
                                &ldquo;Autodetect motor type&ldquo; button to
                                set the appropirate motor type automatically.
                            </li>
                            <li>
                                Click on the &apos;ENABLE FETS&apos; button from
                                the Log Window.
                            </li>
                            <li>Set the position to -2.</li>
                            <li>Set the time limit to 2.</li>
                            <li>
                                Select the correct alias detected in our
                                previous step.
                            </li>
                        </ol>
                        <p>
                            After you press the execute button, the motor will
                            spin two revolutions in two seconds.
                        </p>
                        <p>
                            You can see below the actual conversions that are
                            made to translate the human-understandable units to
                            something that our MCU understands and executes, we
                            advise you to check out our COMMANDS PROTOCOL page
                            to learn more.
                        </p>
                        <Command2
                            {...props}
                            getAxisSelection={props.getAxisSelection}
                            sendDataToSerialPort={props.sendDataToSerialPort}
                            LogAction={props.LogAction}
                            constructCommand={props.constructCommand}
                        >
                            <SelectAxis
                                LogAction={props.LogAction}
                                axisSelectionValue={props.axisSelectionValue}
                                setAxisSelectionValue={
                                    props.setAxisSelectionValue
                                }
                            ></SelectAxis>
                        </Command2>
                        <hr />
                        <div className="text-center w-full flex flex-col justify-center items-center">
                            <h2>
                                {" "}
                                Congrats on making it this far! We now believe
                                you are ready to explore the rest of the
                                commands on your own.
                            </h2>
                            <Image
                                className="w-[200px] h-auto"
                                loading="eager"
                                src={"/fireworks.svg"}
                                sizes="100vw"
                                width={0}
                                height={0}
                                alt="motor to rs-485 wiring"
                            ></Image>
                        </div>
                    </article>
                </div>
            </animated.div>
        </>
    );
}
export default Tutorial;
