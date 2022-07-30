const TestComponent = (props:any) => {
  return (
    <>
    <div>
        <p>
            I am the Test component and you can see my children below
        </p>
        {props.children}
    </div>
    </>
  )
}
export default TestComponent
