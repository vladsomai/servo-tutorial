const LoadingScreen = () => {
    return (
        <>
            <div className="fixed h-screen w-screen flex flex-col justify-center items-center">
                <div className="w-[50px] h-[50px] bg-slate-50  rounded-full animate-ping"></div>
                <h1 className="text-3xl md:text-6xl mt-16">Loading...</h1>
            </div>
        </>
    );
};
export default LoadingScreen;
