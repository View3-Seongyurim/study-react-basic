# 🔎 Hooks 자세히 보기

## 1. `useState`

> ✅ **값을 세팅하고 저장해야할 때**

```javascript
const [name, setName] = useState('')
```

```html
<input
  ref="{nameRef}"
  value="{name}"
  onChange="{(e) => setName(e.target.value)}"
  placeholder="이름"
/>
```

- 사용자 입력이 바뀔 때마다 setName()으로 상태 업데이트
- 입력 필드에는 value={name} 으로 연결해서 실시간 반영

---

## 2. `useRef`

> ✅ **DOM 요소에 직접 접근하고 싶을 때**

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

- useRef(null)은 '아직 아무 DOM도 참조하지 않고 있음'을 의미
- nameRef는 객체이고, 내부에 .current라는 속성을 가지고 있음
- 나중에 이 .current에 실제 DOM 요소가 자동으로 들어감

```javascript
useEffect(() => {
  nameRef.current?.focus()
}, [])
```

- 자동 포커스 기능에 활용되었음
- 컴포넌트가 처음 렌더링될 때 .current에 담긴 input에 .focus()를 실행

**💡 유의사항**

- useRef는 변경 시 리렌더링되지 않음
- 따라서 useRef는 리렌터링 없이 값을 저장하거나 DOM을 조작할 때에만 사용

---

## 3. `useEffect`

> ✅ **컴포넌트의 사이드 이펙트를 처리할 때**

- 리액트 컴포넌트가 렌더링되고 난 다음에 실행되는 함수
- [ ]: 의존성 배열(비어 있으면 최초 한 번만 실행)

```javascript
useEffect(() => {
  if (submitted) {
    setName('')
    setContact('')
    setRegion('')
    dispatch({ type: 'RESET' })
    nameRef.current?.focus()
  }
}, [submitted])
```

- 의존성 배열에 submitted가 있으므로 submitted 값이 변할 때마다 실행
- 조건이 충족되면 상태와 에러를 초기화하고 이름 input에 포커싱

**💡 의존성 배열**

```javascript
useEffect(fn, [a, b])
```

- a나 b가 바뀔 때마다 fn을 실행

---

## 4. `useReducer`

> ✅ **복잡한 상태를 깔끔하게 관리할 때**

### 4.1 useReducer 호출

```javascript
const initialState = { nameError: '', contactError: '' }
const [errors, dispatch] = useReducer(reducer, initialState)
```

- `reducer`: 상태 변경 방법을 정의한 함수
- `initialState`: 초기 상태
- `errors`: 현재 상태 값
- `dispatch`: 상태를 변경할 수 있는 함수

### 4.2 상태 변경 요청: dispatch(action) 호출

```javascript
dispatch({ type: 'VALIDATE', payload: { name, contact } })
```

- 사용자가 문의하기 버튼을 클릭했을 때 실행

### 4.3 리액트가 내부적으로 reducer(state, action) 실행

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

- state: 현재 상태(errors)
- action: 우리가 dispatch로 보낸 객체
- 새 상태 객체가 반환되고, errors가 자동으로 갱신됨

### 4.4 JSX에서 갱신된 errors 상태 활용

```javascript
{
  errors.nameError && <p>{errors.nameError}</p>
}
```

- 상태가 바뀌었기 때문에 컴포넌트가 다시 렌더링됨
- 에러 메세지가 있으면 화면에 표시되고, 없으면 표시되지 않음

---

## 5. `useContext`

> ✅ **전역 상태(또는 테마, 로그인 등)를 공유할 때**

- context: 리액트의 공용 전역 저장소
- props 없이도 전역 상태를 꺼내 쓰게 해주는 리액트의 공유 시스템

### 5.1 공유할 변수 설정

```javascript
const [dark, setDark] = useState(false)
const toggleTheme = () => setDark((prev) => !prev)
```

### 5.2 `createContext()` - 공유할 공간(객체) 만들기

```javascript
const ThemeContext = createContext()
```

- 전역으로 상태를 공유할 수 있는 컨텍스트 객체 생성

### 5.3 `<Provider>` - 공유할 값을 정의해주는 역할

```javascript
<ThemeContext.Provider value={{ dark, toggleTheme }}>{children}</ThemeContext.Provider>
```

- value로 넘긴 값이 하위 컴포넌트 어디서든 꺼내 쓸 수 있게 됨
- 이는 보통 ThemeProvider라는 컴포넌트 안에 감싸서 관리

### 5.4 App.jsx에서 `Provider`로 감싸기

```javascript
<ThemeProvider>
  <InquiryForm />
</ThemeProvider>
```

- 이렇게 해야 그 안쪽 컴포넌트들이 useContext로 값을 꺼낼 수 있음

### 5.5 커스텀 훅을 만들어서 더 깔끔하게 쓰기

```javascript
export function useTheme() {
  return useContext(ThemeContext)
}

const { dark, toggleTheme } = useTheme()
```

### 5.6 하위 컴포넌트에서 상태 꺼내 쓰기

```javascript
const { dark, toggleTheme } = useTheme()
```

```html
<button onClick="{toggleTheme}">{dark ? 'LIGHT MODE' : 'DARK MODE'}</button>
```

---

## 6. `useActionState`

> ✅ **비동기 폼 제출 & 로딩 상태 관리를 한 번에 처리할 때**

- React 19(2024-12-05)

```javascript
const [submittedForm, submitForm, isPending] = useActionState(async (prevState, formData) => {
  await new Promise((res) => setTimeout(res, 1500))
  return formData
}, null)
```

- `submittedForm`: 제출된 최종 데이터(상태)
- `submitForm()`: 실제로 제출을 트리거하는 함수
- `isPending`: 제출 중인지 아닌지(로딩 상태)
- 첫 번째 인자(async 함수): 제출이 일어날 때 실행할 비동기 로직
- 두 번째 인자(null): 초기 상태

```javascript
submitForm({ name, contact, region })
```

- async 함수가 실행됨
- isPending 값이 true가 됨 → "문의내역 제출중..." 으로 문구 변경
- await 로직이 끝나면 결과(formData)가 submittedForm에 저장됨
- isPending 값이 다시 false로 바뀜 → "문의하기" 문구로 돌아감
- submittedFrom 값이 바뀌면서 리렌더링 발생 → 완료 메시지 뜸

```html
<button className="btn-submit btns" type="submit" disabled="{isPending}">
  {isPending ? '문의내역 제출중...' : '문의하기'}
</button>
```

- isPending에 따라 로딩중 UI 표시

---

## 7. `useCallback`

> ✅ **컴포넌트가 렌더링될 때마다 같은 함수라도 새로 생성되는 걸 막아야할 때**

```javascript
useCallback(fn, [dependency, ...])
```

- 리액트에서 함수는 기본적으로 매 렌더링마다 새로운 함수로 취급됨
  - 그렇게 되면,
    - 불필요하게 자식 컴포넌트가 리렌더링되거나
    - 메모이제이션된 값이 재계산되거나
    - 의존성 배열이 매번 바뀌었다고 인식됨
- 따라서 `useCallback`을 쓰면 의존성이 바뀌지 않는 한 이 함수는 변하지 않음
- 즉, 함수의 불필요한 재생성을 방지
- 성능을 최적화하기 위한 예방 조치

**💡 문제가 되는 대표 상황 2가지**

- 자식 컴포넌트에 props로 함수를 넘길 때
- useEffect, useMemo의 의존성 배열에 함수가 있을 때

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

- 사실 지금 프로젝트에서는 useCallback이 필요한 상황은 아님
- handleSubmit이 props로 내려가거나, useEffect의 의존성에 포함되지 않았기 때문
