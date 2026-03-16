import React from 'react'
type product = {
  name: string
  price: number
  description: string
  inStock: boolean
} 
const marketplace: product = {  
  name: 'product1',
  price: 0,
  description: 'best product ever',
  inStock: true
}
const network = {
  name: 'network1',
  price: 0, 
  description: 'best network ever',
  inStock: true
}
type headerprops = {
  title?:string
  age?:number
  showTitle?:boolean
data?: product
 }
function Header({title, age, showTitle = false, data}:headerprops) {
  return (
    <div>
      {showTitle && <h1 style={{ color: 'white' , background: 'red', marginTop: '100px' , padding: '20px' }}>
        This is a header: {title}
         <span style={{backgroundColor: 'yellow' , color: 'black' }}> Age: {age}</span></h1>} 

      {data && <div>
        <h2>{data.name}</h2>
        <p>{data.description}</p>
        <p>Price: ${data.price}</p>
        <p>{data.inStock ? 'In Stock' : 'Out of Stock'}</p>
      </div>}
     </div>
  )
}

function page() {
  return (
    <div>
      <Header title='Marketplace' age={25} showTitle data={marketplace}/>
      <Header title='Network' age={30}  showTitle data={network}/>
      
    </div>
  )
}

export default page
