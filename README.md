# 📝 가맹문의 폼

## 1. Vite + React 프로젝트 초기화

```bash
npm create vite@latest
```

- Project name: 리포지토리명과 통일하였음
- Framework: React
- Variant: JavaScript

```bash
npm install
npm run dev
```

- 브라우저에서 localhost:5173 접속
- Vite + React 페이지가 정상적으로 로드되면 성공

\***option**: Prettier 설치

```bash
npm install --save-dev prettier
```

- `--save-dev`: 개발 도구용으로만 설치
- 이후 `.prettierrc`, `.prettierignore` 파일 정의

---

## 2. React Hooks 개요

> [🔮 React Hooks 기초 - 자세히 보기](/hooks-detail.md)

- **`useState`**: 각 인풋 필드의 상태를 저장
- **`useRef`**: DOM에 직접 접근하여 포커싱
- **`useEffect`**: 마운트 시 포커스, 제출 후 폼 초기화
- **`useReducer`**: 유효성 검사 상태 및 에러 메시지 관리
- **`useContext`**: 테마 토글 기능(다크/라이트)
- **`useActionState`**: 제출 시 비동기 처리(1.5초 delay) + 버튼 상태 제어
- **`useCallback`**: handleSubmit 핸들러 메모이제이션
- **`useMemo`**: 제출된 내용을 요약해서 보여줄 때 리렌더 최적화

---

## 3. 앱 구조

### 📁 src/components/InquiryForm.jsx

- 사용자가 이름, 연락처, 지역을 입력하고 제출
- 입력 유효성 검사
- 제출 시 1.5초 로딩 후 결과 출력

### 📁 src/context/ThemeContext.jsx

- 테마 토글을 위한 Context API 사용
- Context API: useContext, createContext, useState

<details>
<summary>🧠 궁금한 점</summary>
<div markdown="1">

  > **"왜 ThemeContext는 components가 아니라 context 폴더에 보관될까?"**
  - UI 요소를 보관해두는 components와 달리, ThemeContext는 상태를 생성하고 제공(`Provider`)하는 유틸성 로직이기 때문
  - 목적: 렌더링 NO 전역상태 관리 YES
  - 즉 context에는 **전역으로 모든 컴포넌트에서 공유되어야 하는 상태나 기능**이 포함됨
  - 이 폴더에 포함되는 다른 요소들: `theme`, `auth`, `modal`, ...

</div>
</details>

### 📁 src/App.jsx

- 위 두 컴포넌트를 조립해서 화면 구성

### 📁 src/main.jsx

- React 앱의 진입점
- DOM에 React 앱을 마운트(붙이는 역할)