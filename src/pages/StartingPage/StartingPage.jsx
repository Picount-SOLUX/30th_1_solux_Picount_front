
// src/pages/Landing.jsx
import { useNavigate } from 'react-router-dom'
import './StartingPage.css'

export default function StartingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing-container">
      <div className="content">
        <h1 className="title">
          <div className = "vector-wrapper">
            <img src = 'src/assets/Vector.png' alt = "벡터" className='vector-img'/>
            <img src = 'src/assets/Vector (1).png' alt = "벡터" className='vector1-img'/>
          </div>
          PICOUNT</h1>
        <button onClick={() => navigate('/login')}>로그인</button>
        <button onClick={() => navigate('/join')}>회원가입</button>
      </div>
    </div>
  )
}
