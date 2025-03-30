## 1. Vite + React 프로젝트 초기화

```
npm create vite@latest
```

- Project name: 리포지토리명과 통일하였음
- Framework: React
- Variant: JavaScript

```
npm install
npm run dev
```

- 브라우저에서 localhost:5173 접속
- Vite + React 페이지가 정상적으로 로드되면 성공

\***option**: Prettier 설치

```
npm install --save-dev prettier
```

- `--save-dev`: 개발 도구용으로만 설치
- 이후 `.prettierrc`, `.prettierignore` 파일 정의

---

## 2. 주요 리액트 훅

- **`useState`**: 각 인풋 필드의 상태를 저장하기 위해 사용
- **`useActionState`**: 제출 시 비동기 처리 (2초 delay) + 버튼 상태 제어
- **`useEffect`**: 마운트 시 포커스 / 제출 후 폼 초기화
- **`useRef`**: 인풋 포커스 및 DOM 직접 접근
- **`useMemo`**: 제출된 내용을 요약해서 보여줄 때 리렌더 최적화
- **`useCallback`**: handleSubmit 핸들러 메모이제이션
- **`useContext`**: 테마 토글 기능
- **`useReducer`**: 유효성 검사 상태 및 메시지 관리
