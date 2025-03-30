import InquiryForm from './components/InquiryForm'
import { ThemeProvider } from './context/ThemeContext'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <InquiryForm />
    </ThemeProvider>
  )
}

export default App
