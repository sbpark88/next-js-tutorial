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

### Form Validation

- Client-Side validation: `required`만 붙여주면 브라우저가 기본적으로 validation check 를 해준다. 쉽지만
  이를 우회하는 공격에 무용지물이며, 서버에서 다시 검증해야 하므로 validation check 코드가 2개가 되므로 양쪽을 모두
  관리 해야한다.
- Server-Side validation: Client-Side validation check 를 우회하는 공격을 막아낼 수 있으며, 서버 에서
  하나의 소스로 관리한다.

- 여기서 Client Component 에서는 React 19 에 출시될 `useActionState` 훅을 사용했다.
  이 훅은 `(action, initialState)`를 arguments 로 받아 `[state, formAction]`을 반환한다.
- Server Action 에서는 `zod`의 기능을 사용한다. zod 는 단순히 타입 검증 뿐 아니라 검증 실패에 따라 각 필드별
  validation 실패에 따른 메시지를 객체로 생성한다.

`actions.ts`와 `create-form.tsx`, `edit-form.tsx` 파일을 보자. `useActionState(action:initialState)` 
함수는 2개의 파라미터를 받는다.  
그리고 이 `action`은 `(state: Awaited<State>, payload: FormData) => (Promise<State> | State)` 형태를 
파라미터로 받도록 되어 있다.

그런데 기존의 `createInvoice`와 `updateInvoice` action 함수는 다음과 같다.

- `createInvoice(formData:)`
- `updateInvoice(id:formData:)`

1. `useActionState`에 전달할 action 함수는 `action(state:payload:)`이어야 하므로,  
   `createInvoice(formData:)`는 `createInvoice(prevState:formData:)`로 변경하면 된다.

2. 그런데 `updateInvoice(id:formData:)`는 `id`를 받아야하므로 파라미터 순서를 다음과 같이 만들어야한다. 
   `updateInvoice(id:formData:)`를 `updateInvoice(id:prevState:formData:)`로 변경하고  
   `const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);`를 통해 바인딩 시켜 새 action 
   함수를 만들면  
   `updateInvoiceWithId(prevState:formData:)`는 이제 `useActionState`에 전달할 action 함수의 형태가 된다.

---

# NextAuth

`useActionState`와 마찬가지로 Next.js 14 에 추가될 예정으로, Next.js 앱에 세션을 관리하고, 
로그인(sign-in, sign-out), 그 외 다른 인증 관련된 것들을 추상화 시켜 간단한 절차로 통일된 솔루션을 제공한다.

```shell
pnpm i next-auth@beta
```

앱에서 사용할 암호키를 생성해야한다.

```shell
openssl rand -base64 32
```

이 암호키는 앱에서 쿠키를 암호화하고, 사용자 세션의 보안을 보장하는 데 사용된다. 이재 `.env`파일에 위에서 생성한 암호키를 
추가해야한다.

- `.env`

```shell
AUTH_SECRET=your-secret-key
```

- https://authjs.dev/getting-started/authentication
- https://authjs.dev/reference/nextjs#nextauthconfig
- https://authjs.dev/reference/nextjs#pages
- https://authjs.dev/reference/nextjs#callbacks
- https://authjs.dev/reference/nextjs#providers
- https://nextjs.org/docs/app/building-your-application/routing/middleware

이 외에도 전체 문서에서 필요한 부분을 검색해 사용해야하나, 이 튜토리얼을 진행하며 프로젝트에서 참고한 레퍼런스는 위와 같다.

### auth.config.ts & auth.ts

`auth.config.ts`는 기본 설정값을 저장하는 config 파일로 `middleware`와 `auth.ts`에서 사용한다. 
`auth.ts`는 config 를 불러와 Spread Operator 로 복사하고 필요한 부분을 수정해 사용한다. 
따라서, 두 파일을 모두 봐야 한다. 

### middleware.ts

각 페이지나 파일 등 리소스를 요청할 때마다 인증 검증을 위해 `middleware`를 반드시 사용해야한다. 필요한 함수는 
NextAuth 에 모두 들어 있으므로 `auth.config.ts`를 가져와 필요한 인스턴스를 생성하고, 적용할 리소스를 명시하면 된다.

```typescript
export default NextAuth(authConfig).auth;
```

### Providers

4 종류가 제공된다.

- OAuth: Google, GitHub, Twitter, etc.
- Magic Links: Resend, Sendgrid, Nodemailer, Postmark, etc.
- Credentials: Email/PW 를 사용해 직접 인증.
- WebAuthn: 실험적 기능으로 아직 production 에서 사용은 권장하지 않음.

---

# Metadata

사용자에게 보이지 않지만 중요한 정보를 주로 `head` 태그 안에 내장시켜 검색 엔진이나 소셜 미디어 등 웹을 더 잘 이해할 
수 있도록 HTML 페이지에 내장된 정보를 `Metadata` 라 한다. 

### Title Metadata

가장 기본적인 메타데이터로 브라우저의 탭에 이름을 보이게 할 뿐 아니라, 검색 엔진이 웹페이지에 대해 이해하는 데 도움을 
줘 SEO 에 매우 중요한 역할을 한다.

```html
<title>Page Title</title>
```

### Description Metadata

이 메타데이터는 웹 페이지 콘텐츠에 대한 간략한 개요를 제공하며 종종 검색 엔진 결과에 표시된다.

```html
<meta name="keyword" content="keyword1, keyword2, keyword3" />>
```

### Open Group Metadata

이 메타데이터는 웹 페이지가 소셜 미디어 플랫폼에 공유될 때 'title', 'description', 'image' 와 같은 정보를 제공해 
표시되는 방법을 향상시킨다.

```html
<meta property="og:title" content="Title Here" />
<meta property="og:description" content="Description Here" />
<meta property="og:image" content="image_url_here" />
```

### Favicon Metadata

이 메타데이터는 브라우저의 주소 바 또는 탭에 표시될 `favicon`이라 불리는 작은 아이콘 이미지에 대한 링크를 제공한다.

### Adding metadata in Next.js

- Config-based: `layout.tsx` 또는 `page.tsx`에서 [static `metatdata` object] 또는 dynamic 
  [`generateMetadata` function] 을 export 한다.
- File-based: metadata 목적으로 사용되는 특별한 파일 이름을 사용한다.
  - `favicon.ico`, `apple-icon.jpg`, `icon.jpg`: favicon 또는 icon 으로 사용된다.
  - `opengraph-image.jpg`, `twitter-image.jpg`: 소셜 미디어에 사용된다.
  - `robots.txt`: 검색 엔진 크롤링에 정보를 제공한다.
  - `sitemap.xml`: 웹사이트 구조에 대한 정보를 제공한다.

어떤 방법을 사용하든 Next.js 는 자동으로 `head` 태그 안에 내장시킨다.




[static `metatdata` object]:https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-object
[`generateMetadata` function]:https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
