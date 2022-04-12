import storeItems from "./items.json"
import Store from "./components/Store"
import Cart from "./components/Cart"
import useAlan from "./hooks/useAlan"
import './index.css'
function App() {
  useAlan()
  const StyleObj = {
    fontSize: 40,
    color: "black",
    textAlign: "center",
    marginTop: 20
  }
  return (
    <>
      <h1 style={StyleObj}>Ecommerce App </h1>
      <p className="text" >Credit : Muhammad Puteela</p>
      <Store items={storeItems} />
      <Cart />
    </>
  )
}

export default App
