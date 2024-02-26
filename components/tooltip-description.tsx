export interface tooltipDescriptionType {
    Description: string[];
}

const TooltipDescription = (props: tooltipDescriptionType) => {
    return (
        <>
            <div>
                {props.Description.map((item, index) => (
                    <p key={index}>{item}</p>
                ))}
            </div>
        </>
    );
};
export default TooltipDescription;
