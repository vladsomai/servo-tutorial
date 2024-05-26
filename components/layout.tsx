import Footer from "./footer";
import Modal from "./modal";
import Alert from "./alert";

export default function Layout({ session, children }: any) {
    return (
        <>
            <main className="tracking-wider h-[97vh]">
                <Modal />
                <Alert />
                {children}
            </main>
            <div className="h-[3vh] fixed bottom-0 flex justify-center w-full bg-base-100">
                <Footer />
            </div>
        </>
    );
}
