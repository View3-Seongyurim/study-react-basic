# 🔮 React Hooks 기초

## 1️⃣ `useState`

### 1.1 개요

```javascript
const [state, setState] = useState(initialState)
```

- **용도**: 상태 저장 및 세팅

### 1.2 활용

```javascript
const [name, setName] = useState('')
```

```html
<input
  value="{name}"
  onChange="{(e) => setName(e.target.value)}"
  placeholder="이름"
/>
```

- 사용자 입력이 바뀔 때마다 `setName()`으로 상태 업데이트
- 입력 필드에는 `value={name}` 으로 연결해서 실시간 반영

---

## 2️⃣ `useRef`

### 2.1 개요

```javascript
const myRef = useRef(null)
```

- **용도**: DOM 요소에 직접 접근하여 조작

### 2.2 활용

```javascript
const nameRef = useRef(null)
```

```html
<input
  ref="{nameRef}"
  value="{name}"
  onChange="{(e) => setName(e.target.value)}"
  placeholder="이름"
/>
```

- `useRef(null)`은 '아직 아무 DOM도 참조하지 않고 있음'을 의미
- `nameRef`는 객체이고, 내부에 `current`라는 속성을 가지고 있음
- 나중에 이 `current`에 실제 DOM 요소가 자동으로 들어감

```javascript
useEffect(() => {
  nameRef.current?.focus()
}, [])
```

- 자동 포커스 기능에 활용되었음
- 컴포넌트가 처음 렌더링될 때 `current`에 담긴 `input`에 `focus()`를 실행

### 2.3 유의사항

- `useRef`는 변경 시 리렌더링되지 않음
- 따라서 useRef는 리렌더링 없이 값을 저장하거나 DOM을 조작할 때에만 사용

---

## 3️⃣ `useEffect`

### 3.1 개요

```javascript
useEffect(() => {
  //부수효과 처리
}, [dependency])
```

- **용도**: 컴포넌트의 사이드 이펙트 처리
- **실행시점**: 리액트 컴포넌트가 렌더링되고 난 후
- **[ ]**: 의존성 배열(비어 있으면 최초 한 번만 실행)

### 3.2 활용

```javascript
useEffect(() => {
  if (submittedForm) {
    setName('')
    setContact('')
    setRegion('')
    dispatch({ type: 'RESET' })
    nameRef.current?.focus()
  }
}, [submittedForm])
```

- 의존성 배열에 있는 `submittedForm` 값이 변할 때마다 실행
- 조건이 충족되면 상태와 에러를 초기화하고 이름 `input`에 포커싱하는 로직

---

## 4️⃣ `useReducer`

### 4.1 개요

```javascript
const [state, dispatch] = useReducer(reducer, initialState)
```

- **용도**: 상태 전환 로직이 복잡할 경우 구조화해서 관리

### 4.2 활용

#### 4.2.1 `useReducer` 호출

```javascript
const initialState = { nameError: '', contactError: '' }
const [errors, dispatch] = useReducer(reducer, initialState)
```

- `reducer`: 상태 변경 방법을 정의한 함수
- `initialState`: 초기 상태
- `errors`: 현재 상태 값
- `dispatch`: 상태를 변경할 수 있는 함수

#### 4.2.2 상태 변경 요청: `dispatch(action)` 호출

```javascript
dispatch({ type: 'VALIDATE', payload: { name, contact } })
```

- 사용자가 문의하기 버튼을 클릭했을 때 실행

#### 4.2.3 리액트가 내부적으로 `reducer(state, action)` 실행

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'VALIDATE':
      return {
        nameError: action.payload.name ? '' : '이름을 입력해주세요.',
        contactError: /^\d{10,11}$/.test(action.payload.contact)
          ? ''
          : '연락처 형식이 올바르지 않습니다.',
      }
    ...
  }
}
```

- `state`: 현재 상태(`errors`)
- `action`: `dispatch`로 보낸 객체
- 새 상태 객체가 반환되고 `errors`가 자동으로 갱신됨

#### 4.2.4 JSX에서 갱신된 errors 상태 활용

```javascript
{errors.nameError && <p>{errors.nameError}</p>}
```

- 상태가 바뀌었기 때문에 컴포넌트가 다시 렌더링됨
- 에러 메세지가 있으면 화면에 표시되고, 없으면 표시되지 않음

---

## 5️⃣ `useContext`

### 5.1 개요

```javascript
const value = useContext(MyContext)
```

- **용도**: 전역 상태(테마, 로그인, 인증 등) 공유
- **정의**: props 없이도 전역 상태를 꺼내 쓸 수 있게 해주는 리액트의 공유 시스템
- **`context`**: 리액트의 공용 전역 저장소

### 5.2 활용

#### 5.2.1 공유할 변수 설정

```javascript
const [dark, setDark] = useState(false)
const toggleTheme = () => setDark((prev) => !prev)
```

- `ThemeContext.jsx`에 설정

#### 5.2.2 `createContext`로 공유할 공간(객체) 만들기

```javascript
const ThemeContext = createContext()
```

- 전역으로 상태를 공유할 수 있는 컨텍스트 객체 생성

#### 5.2.3 `<Provider>`로 공유할 값을 정의해주기

```html
<ThemeContext.Provider value={{ dark, toggleTheme }}>
  {children}
</ThemeContext.Provider>
```

- `value`로 넘긴 값을 하위 컴포넌트 어디서든 꺼내 쓸 수 있게 됨
- 이는 보통 `ThemeProvider`라는 컴포넌트 안에 감싸서 관리

#### 5.2.4 App.jsx에서 `Provider`로 감싸기

```javascript
<ThemeProvider>
  <InquiryForm />
</ThemeProvider>
```

- 이렇게 해야 그 안쪽 컴포넌트들이 `useContext`로 값을 꺼낼 수 있음

#### 5.2.5 커스텀 훅 만들기

```javascript
export function useTheme() {
  return useContext(ThemeContext)
}
```

#### 5.2.6 하위 컴포넌트에서 상태 꺼내 쓰기

```javascript
import { useTheme } from '../context/ThemeContext'
const { dark, toggleTheme } = useTheme()
```

```html
<button onClick="{toggleTheme}">{dark ? 'LIGHT MODE' : 'DARK MODE'}</button>
```

- 위에서 만든 `useTheme` 커스텀 훅으로 상태를 간편하게 꺼내 쓸 수 있음

---

## 6️⃣ `useActionState`

### 6.1 개요

```javascript
const [result, submitAction, isPending] = useActionState(async (prevState, formData) => {
  // 비동기 작업
  return resultValue
}, initialState)
```

- **용도**: 상태 & 비동기 액션 & 로딩 상태를 한 번에 관리
- **도입**: React 19 (2024-12-05)

<details>
<summary>🧠 궁금한 점</summary>
<div markdown="1">

  > **"그렇다면 React 19 전에는 어땠을까?"**
  
  ```javascript
  const [state, setState] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await submitForm(formData)
      setState(result)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }
  ```

  - 상태가 여러 개로 분산됨: `state`, `isLoading`, `error`
  - useActionState는 이 상태들을 하나의 흐름으로 묶어주는 역할을 하는 것

</div>
</details>

### 6.2 활용

#### 6.2.1 `useActionState` 호출

```javascript
const [submittedForm, submitForm, isPending] = useActionState(async (prevState, formData) => {
  await new Promise((res) => setTimeout(res, 1500))
  return formData
}, null)
```

- `submittedForm`: 제출된 최종 데이터(상태)
- `submitForm`: 실제로 제출을 트리거하는 함수
- `isPending`: 제출 중인지 아닌지?(로딩 상태)
- 첫 번째 인자(async 함수): 제출이 일어날 때 실행할 비동기 로직
- 두 번째 인자(null): 초기 상태

#### 6.2.2 비동기 함수 실행시키기

```javascript
submitForm({ name, contact, region })
```

- async 함수가 실행됨
- isPending 값이 true가 됨 → "문의내역 제출중..." 으로 문구 변경
- await 로직이 끝나면 결과(formData)가 submittedForm에 저장됨
- isPending 값이 다시 false로 바뀜 → "문의하기" 문구로 돌아감
- submittedFrom 값이 바뀌면서 리렌더링 발생 → 완료 메시지 뜸

### 6.3 pending 상태인 경우 UI 반영

```html
<button className="btn-submit btns" type="submit" disabled="{isPending}">
  {isPending ? '문의내역 제출중...' : '문의하기'}
</button>
```

- isPending에 따라 로딩중 UI 표시

---

## 7️⃣ `useCallback`

### 7.1 개요

```javascript
useCallback(fn, [dependency, ...])
```

- **용도**: 컴포넌트가 렌더링될 때 동일한 함수가 매번 새로 생성되는 것을 막기 위한 최적화

#### 7.1.1 `useCallback`이 필요한 이유

- 리액트에서 함수는 기본적으로 매 렌더링마다 새로운 함수로 취급됨
  - 그렇게 되면?
  - 불필요하게 자식 컴포넌트가 리렌더링되거나
  - 메모이제이션된 값이 재계산되거나
  - 의존성 배열이 매번 바뀌었다고 인식됨
- 따라서 `useCallback`을 쓰면 의존성이 바뀌지 않는 한 이 함수는 변하지 않음
- 함수의 불필요한 재생성을 방지하여 성능을 최적화하고자 하는 예방 조치
- 즉 `useCallback`은 **함수 참조의 불변성을 유지하기 위한 캐싱**

#### 7.1.2 문제가 되는 대표 상황 2가지

- 자식 컴포넌트에 props로 함수를 넘길 때
- `useEffect`, `useMemo`의 의존성 배열에 함수가 있을 때

### 7.2 활용

```javascript
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
```

```html
<form onSubmit="{handleSubmit}"></form>
```

- 사실 지금 프로젝트에서는 `useCallback`이 필요한 상황은 아님
- `handleSubmit`이 props로 내려가거나, `useEffect`의 의존성에 포함되지 않았기 때문

---

## 8️⃣ `useMemo`

### 8.1 개요

```javascript
const memoizedValue = useMemo(() => {
  return someHeavyCalculation(props.x)
}, [props.x])
```

- **용도**: 값을 기억하여 불필요한 재계산 방지 및 성능 최적화
- **필요한 이유**:
  - 리액트 컴포넌트는 상태나 props가 바뀌면 안에 있는 함수나 계산식도 모두 다시 실행됨
  - 그런데 시간이 오래 걸리는 어떤 복잡한 계산이 있다면? 성능 낭비 야기
  - 이 경우 `useMemo`를 사용하면 리액트가 계산된 값을 기억해뒀다가 재사용할 수 있게 해줌


### 8.2 활용

```javascript
const summary = useMemo(() => {
  if (!submittedForm) return ''
  return (
    <>
      ・ 이름: {submittedForm.name}<br>
      ・ 연락처: {submittedForm.contact}<br>
      ・ 희망지역: {submittedForm.region.trim() ? submittedForm.region : '미지정'}
    </>
  )
}, [submittedForm])
```

- `submittedForm`이 바뀔 때에만 `summary`를 다시 계산
- 그 외엔 계산된 결과를 재사용
- 즉, 문의 완료 메세지를 리렌더링할 때 불필요하게 다시 계산하지 않도록 하는 최적화

### 8.3 언제 쓰면 좋을까?

- 복잡한 계산 결과를 캐싱하고 싶을 때
- 객체나 배열이 렌더링마다 새로 만들어져서 자식 컴포넌트가 불필요하게 리렌더링될 때
- 굳이 필요 없는 경우: 간단한 텍스트 연산 같은 경우

### 8.4 `useMemo` vs `useCallback`

- 공통점: 메모이제이션 기능
- 차이점:

| 항목      | `useMemo`                             | `useCallback`                          |
|-----------|---------------------------------------|----------------------------------------|
| 기억 대상 | **값(계산 결과)**                      | **함수**                               |
| 언제 쓰나 | 복잡한 계산 결과를 기억해두고 재사용할 때 | 함수가 재생성되는 걸 막고 싶을 때         |
| 목적     | 계산 성능 최적화                         | 렌더링 최적화 / 불필요한 함수 재생성 방지 |
