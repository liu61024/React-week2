import axios from "axios";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [isAuth, setIsAuth] = useState(false)
  //使用者未登入是使用者未登入是false狀態，登入成功就是ture狀態，就可以渲染產品畫面

  const [tempProduct, setTempProduct] = useState({});
  const [products, setProducts] = useState([]); 
  //這次要從API抓Products

  const [account, setAccount] = useState({
    username: "example@test.com",
    password: "example"
  })

  const handleInputChange = (e) => { //綁定onChange
    const { value, name } = e.target; //value, name可以被解構出來
    setAccount({
      ...account, //展開
      [name]: value //可以把帳密的值帶入
    })
  }

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post(`${BASE_URL}/v2/admin/signin`, account)
      .then((res) => {
        const { token, expired } = res.data;
        console.log(token, expired);
        document.cookie = `myToken=${token}; expires = ${new Date(expired)}`;

        axios.defaults.headers.common['Authorization'] = token;

        axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`)
          .then((res) => setProducts(res.data.products))
          .catch((err) => console.log(err))
        setIsAuth(true);
      })
      .catch((err) => alert("登入失敗~"))
  }

  const checkUserLogin = () =>{
    axios.post(`${BASE_URL}/v2/api/user/check`)
    .then((res) => alert("登入成功!"))
    .catch((err) => alert("登入失敗!"))
  }
  
  return (
    <>
      {isAuth ? (<div className="container py-5">
        <div className="row">
          <div className="col-6">
            <button type="button" onClick={checkUserLogin} className="btn btn-warning">驗證登入</button>
            <h2>產品列表</h2>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">查看細節</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>{product.is_enabled}</td>
                    <td>
                      <button
                        onClick={() => setTempProduct(product)}
                        className="btn btn-primary"
                        type="button"
                      >
                        查看細節
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-6">
            <h2>單一產品細節</h2>
            {tempProduct.title ? (
              <div className="card">
                <img
                  src={tempProduct.imageUrl}
                  className="card-img-top img-fluid"
                  alt={tempProduct.title}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {tempProduct.title}
                    <span className="badge text-bg-primary">
                      
                      {tempProduct.category}
                    </span>
                  </h5>
                  <p className="card-text">商品描述：{tempProduct.description}</p>
                  <p className="card-text">商品內容：{tempProduct.content}</p>
                  <p className="card-text">
                    <del>{tempProduct.origin_price} 元</del> / {tempProduct.price}{" "}
                    元
                  </p>
                  <h5 className="card-title">更多圖片：</h5>
                  {tempProduct.imagesUrl?.map((image) => (image && (<img key={image} src={image} className="img-fluid" />)))}
                </div>
              </div>
            ) : (
              <p>請選擇一個商品查看</p>
            )}
          </div>
        </div>
      </div>) : <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">歡迎登入</h1>
        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <div className="form-floating mb-3">
            <input name="username" value={account.username} onChange={handleInputChange} type="email" className="form-control" id="username" placeholder="name@example.com" />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input name="password" value={account.password} onChange={handleInputChange} type="password" className="form-control" id="password" placeholder="Password" />
            <label htmlFor="password">Password</label>
          </div>
          <button className="btn btn-success">登入</button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 乳蛋農產品</p>
      </div>}
    </>

  )
}

export default App
