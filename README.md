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
- `error.tsx`: 모든 에러의 fallback UI 로 사용된다. 오직 'use client' 만 가능하다.
- `not-found.tsx`: `notFound()` 함수에 의해 호출되어 404 에러의 fallback UI 로 사용된다.


Next.js 의 모든 파일 컨벤션은 [api-reference/file-conventions](https://nextjs.org/docs/app/api-reference/file-conventions) 
에서 확인할 수 있다.

# Styles

- 기본값은 Tailwind CSS 를 사용하지만 module.css 나 module.scss 도 사용할 수 있다. 물론, 둘을 동시에 사용할 수도 
  있으며, Styled Components 나 Emotion 등을 사용하는 것 역시 가능하다.
- Tailwind CSS 의 동적 스타일링은 `String Interpolation` 또는 `clsx` 라이브러리를 사용해 적용한다.

# Atomic Components

- Next.js 는 `img`, `a` 태그 대신 Image`, `Link` 와 같은 Atomic 컴포넌트를 사용해 구현하도록 한다.

# Hooks

`/dashboard/invoices?page=1&query=pending`이 주어질 때

- `usePathname`: `/dashboard/invoices`를 반환.
- `useSearchParams`: ReadonlyURLSearchParams 타입의 `{ page: '1', query: 'pending' }`을 반환.
  `get()`, `getAll()`메서드를 사용해 데이터에 접근. URLSearchParams 에 parameter 로 넣어 인스턴스 
  생성이 가능하다.
- `useRouter`: Client components 간에 프로그래밍을 사용한 네비게이션을 처리.

# Directives

- `'use client'`: event listeners, hooks 를 사용할 수 있다.
- `'use server'`: 클라이언트 컴포넌트, 서버 컴포넌트 모두에서 import 가능하다. 

---

# URL search params 를 사용할 때 얻는 이점

- Bookmarkable and Shareable URLs: 앱의 상태를 북마크하거나 공유할 수 있다.
- Server-Side Rendering and Initial Load: URL 파라미터는 서버에서 초기 상태를 렌더링 하는데 즉시 사용될 수 있어 
  서버 렌더링을 다루기 쉽게 한다.
- Analytics and Tracking: 'Search queries' 와 'Filter' 를 직접 URL 에 넣으면 Client-Side 에 추가적인 로직 
  없이도 사용자의 행동을 추적할 수 있다.

# Server Actions

### 오직 'use server'만 가능

form 의 action 을 다루기 위한 위 코드는 Server Action 으로 오직 서버 컴포넌트로만 존재할 수 있다. 이 말은 'useState', 
'use Effect', 'event listener' 와 같은 것을 사용할 수 없다는 것을 의미한다.

### 민감한 데이터 다루기

Serverless Functions 와 같은 역할을 하지만, API endpoint 를 직접 만들 필요가 없다! Server Actions 는 내부적으로 
`Post` API endpoint 를 생성한다.

FormData 에 UUID 와 같은 노출되어서는 안 되는 데이터를 Server Action 에 보낼 때는
`<input type="hidden" name="id" value={invoice.id} />` 가 아니라

```tsx
const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);

return <form action={updateInvoiceWithId}></form>;
```

와 같이 HTML 에 노출되지 않도록 전달한다.

### Server Action 이 종료될 때

- `revalidatePath(originalPath:)`; revalidate the Next.js cache
- `redirect(url:)`; redirect the user to a new page

를 적절히 사용해주도록 한다.
