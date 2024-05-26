import Chapters, { ChaptersProps } from "./chapter-window";

const Drawer = (props: ChaptersProps) => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center">
                {props.children}
                <label
                    htmlFor="my-drawer-2"
                    className="fixed top-0 btn btn-primary drawer-button lg:hidden"
                >
                    Open drawer
                </label>
            </div>
            {/* <Chapters {...props} /> */}
        </div>
    );
};
export default Drawer;
