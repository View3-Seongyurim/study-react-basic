import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useActionState,
  useReducer,
  startTransition,
} from 'react'
import { useTheme } from '../context/ThemeContext'

const initialState = { nameError: '', contactError: '' }

function reducer(state, action) {
  switch (action.type) {
    case 'VALIDATE':
      return {
        nameError: action.payload.name ? '' : '이름을 입력해주세요.',
        contactError: /^\d{10,11}$/.test(action.payload.contact)
          ? ''
          : '연락처를 입력해주세요. (10~11 숫자만)',
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export default function InquiryForm() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [region, setRegion] = useState('')
  const [submittedForm, submitForm, isPending] = useActionState(async (prevState, formData) => {
    await new Promise((res) => setTimeout(res, 1500))
    return formData
  }, null)
  const [errors, dispatch] = useReducer(reducer, initialState)
  const nameRef = useRef(null)
  const { dark, toggleTheme } = useTheme()

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  useEffect(() => {
    if (submittedForm) {
      setName('')
      setContact('')
      setRegion('')
      dispatch({ type: 'RESET' })
      nameRef.current?.focus()
    }
  }, [submittedForm])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      dispatch({ type: 'VALIDATE', payload: { name, contact } })
      if (name && /^\d{10,11}$/.test(contact)) {
        startTransition(() => {
          submitForm({ name, contact, region })
        })
      }
    },
    [name, contact, region]
  )

  const summary = useMemo(() => {
    if (!submittedForm) return ''
    return (
      <>
        ・ 이름: {submittedForm.name}
        <br />・ 연락처: {submittedForm.contact}
        <br />・ 희망지역: {submittedForm.region.trim() ? submittedForm.region : '미지정'}
      </>
    )
  }, [submittedForm])

  return (
    <div className="form-wrapper">
      <div className="head">
        <h2 className="title">
          <a href="/study-react-basic/">가맹문의</a>
        </h2>
        <button className="btn-theme users-input btns" onClick={toggleTheme}>
          {dark ? 'LIGHT MODE' : 'DARK MODE'}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="users-input"
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
        />
        {errors.nameError && <p className="error-msg">{errors.nameError}</p>}
        <input
          className="users-input"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="연락처"
        />
        {errors.contactError && <p className="error-msg">{errors.contactError}</p>}
        <select className="users-input" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">희망지역</option>
          <option value="서울">서울</option>
          <option value="부산">부산</option>
          <option value="대구">대구</option>
        </select>
        <br />
        <button
          className={`btn-submit btns ${isPending ? 'pending' : ''}`}
          type="submit"
          disabled={isPending}
        >
          {isPending ? '문의내역 제출중...' : '문의하기'}
        </button>
      </form>

      {submittedForm && (
        <div className="summary-box">
          <strong>문의가 정상적으로 제출되었습니다.</strong>
          <p>{summary}</p>
        </div>
      )}
    </div>
  )
}
