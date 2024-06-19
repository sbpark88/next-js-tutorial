## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

---

# Routes

- `layout.tsx`: 각 라우팅 단위별로 레이아웃을 정의하는 컴포넌트로 각 라우트 최상단에 위치한다. 모든 라우트의 최상단에 위치하는 
  `layout.tsx`는 Root Layout 으로 단순한 Layout 의 역할만 하는 게 아니라 전역에 적용할 Global styles CSS 파일을 
  import 한다.
- `page.tsx`: 컴포넌트와 페이지를 구분하는 중요한 기준이다.
- `(forderName)`: 디렉토리 Tree 구조가 그대로 Nested Routes 로 구현된다. 만약, Next.js 빌드를 위한 구조상의 
  Hierarchy Tree 레벨은 적용하되, URL Routing 에 반영되지 않기를 원한다면 `(forderName)`과 같이 작성한다.
- `loading.tsx`: Streaming 하는 방법은 두 가지가 있는데 우선 컴포넌트 렌더링을 `static`에서 `dynamic`으로 바꾸기 위해 
  fetch 함수가 시작될 때 `unstable_noStore()` 함수를 호출해야한다. 
  - 첫 번째 방법은 Page 레벨 단위로 적용할 fallback 제공을 위해 `page.tsx`와 같은 레벨에 `loading.tsx`를 생성하는 것이다.
  - 두 번째 방법은 컴포넌트 단위로 적용하기 위해 React 의 Suspense 를 사용해 Boundary 처리 하는 것이다. 이때 여러 컴포넌트를 
    하나의 그룹으로 묶으려면 Wrapper 컴포넌트를 생성한다(이를 Partial Prerendering 이라 하며, 적용하고자 하는 컴포넌트를 
    Suspense boundary 로 감싸고 fallback 을 제공한 다음 데이터 fetch 를 컴포넌트 안으로 내려준다. 그리고 fetch 함수는 
    시작할 때 unstable_noStore 함수를 호출해 컴포넌트를 dynamic 으로 만들어준다). 

# Styles

- 기본값은 Tailwind CSS 를 사용하지만 module.css 나 module.scss 도 사용할 수 있다. 물론, 둘을 동시에 사용할 수도 
  있으며, Styled Components 나 Emotion 등을 사용하는 것 역시 가능하다.
- Tailwind CSS 의 동적 스타일링은 `String Interpolation` 또는 `clsx` 라이브러리를 사용해 적용한다.

# Atomic Components

- Next.js 는 `img`, `a` 태그 대신 Image`, `Link` 와 같은 Atomic 컴포넌트를 사용해 구현하도록 한다.
