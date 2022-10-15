import HeaderComponent from './Header'
import Main from './Main'
import FooterComponent from './Footer'

const Homepage = ({setError, setErrMsg}) => {
  return (
    <div>
      <HeaderComponent />
      <Main setError={setError} setErrMsg={setErrMsg} />)
      <FooterComponent />
    </div>
  )
}

export default Homepage