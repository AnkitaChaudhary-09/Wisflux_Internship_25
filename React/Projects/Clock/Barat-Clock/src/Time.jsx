function Time(){
  return <div>
    <h2>Current Time:</h2>
    <p>{new Date().toLocaleTimeString()}-
      {new Date().toLocaleDateString()}</p>
  </div>
}
export default Time;