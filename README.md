# Yanban Note 프로젝트✅

### 데모 넣기

Click [here](http://www.naver.com)

## ![image description](https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.pinimg.com%2F736x%2Fb6%2F30%2Fd6%2Fb630d6637954ba0379fb7702d32ee471.jpg&type=a340)

### 🔥프로젝트 소개

<br/>

notion이나 trello서비스에서 볼 수 있는 칸반노트를 구현해 보았습니다.
프로젝트를 생성 하면, 초기상태로 Todo,Doing,Done 이 세가지의 board가 주어집니다. board들을 추가하거나 삭제, 수정 할 수 있습니다. 각 board들에 할 일(task)을 추가하여 프로젝트를 관리합니다. **_board들과 task 목록들을 자유롭게 드래그 하여 위치를 옮길 수 있습니다._**

---

### 💻Skill

<img src="https://img.shields.io/badge/react-61DAFB?style=flat-square&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/typescript-3178C6?style=flat-square&logo=typescript&logoColor=black"> <img src="https://img.shields.io/badge/recoil-3178C6?style=flat-square&logo=recoil&logoColor=black"> <img src="https://img.shields.io/badge/firebase-FFCA28?style=flat-square&logo=firebase&logoColor=white">  
<img src="https://img.shields.io/badge/fontawesome-339AF0?style=flat-square&logo=fontawesome&logoColor=white"> <img src="https://img.shields.io/badge/styled%20components-DB7093?style=flat-square&logo=styled%20components&logoColor=white">  
<img src="https://img.shields.io/badge/netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white">

---

### ⭐️주요 기능 (1인 개발)

> **client**

- board,task 드래그 & 드롭
- project CRUD
- board CRUD
- task CRUD
- 로그인/회원가입

> **server**

- firebase Auth
- firebase Cloud Firestore

---

### 📁프로젝트 구조

```
📦src
 ┣ 📂Atoms         <--application state의 source of truth 폴더. state들을 위한 폴더
 ┃ ┣ 📜project.ts  <--현재 보고 있는 프로젝트의 state
 ┃ ┗ 📜user.ts     <--현재 사용자의 state
 ┣ 📂Components
 ┃ ┣ 📂AddProjectModal <--프로젝트를 추가하는 모달
 ┃ ┣ 📂Board           <--Board (remove,rename,task 추가)
 ┃ ┣ 📂EachProject     <--각각의 프로젝트, 왼쪽 사이드바에 표시됨, and 프로젝트 rename,remove
 ┃ ┣ 📂EditRemoveBox   <--element를 삭제하거나 수정하는 컴포넌트
 ┃ ┣ 📂Input           <--element Input 컴포넌트, form에 포함되어 사용될 수 있음
 ┃ ┣ 📂Menu            <--user display or mutate modal
 ┃ ┣ 📂Modal           <--project mutate modal
 ┃ ┣ 📂ProjectList     <--왼쪽 사이드바에 표시됨
 ┃ ┗ 📂Task            <--board 안에 포함되어 있음. task read,remove,rename
 ┃
 ┣ 📂Layouts
 ┃ ┗ 📂Workspace       <--layout, 왼쪽 사이드바,헤더를 포함하며. url params 에 따라 project가 띄어지게 됨.
 ┃
 ┣ 📂Pages
 ┃ ┣ 📂Home
 ┃ ┣ 📂Login
 ┃ ┣ 📂Project
 ┃ ┗ 📂SignUp
 ┣ 📂Typings           <--Type들을(interface) 를 정리해둔 폴더
 ┃ ┗ 📜db.ts           <--IUser,IProject,Itask,IboardInfo,IboardsOrder,ProjectByNameAndId...
 ┣ 📜App.tsx
 ┣ 📜firebase.ts       <--firebase setting, 프로젝트에 사용될 함수들 정의 ex)createUser,logout,updateProject...
 ┣ 📜index.tsx
 ┣ 📜Router.tsx
 ┣ 📜styled.d.ts
 ┗ 📜Styles.ts
```

---

### 👨‍💻 프로젝트 Issues

> useEffect나 useState 내부(+recoil set 함수)에서 async await(비동기 처리)

  <details>
  <summary>토글 접기/펼치기</summary>
  <div markdown="1">
     async await 함수는 Promise 객체를 return 합니다. 
     useEffect의 경우 아무것도 return하지 않거나 clean up 함수를 return하고, 상태를 set 하는 함수들은 상태를 반환해야 하기 때문에 async await 함수가 될 수 없습니다. 따라서 훅 안이나 밖에 해당 기능을 정의하여 만들어두고 hook안에서 호출하도록 했습니다. 아래 코드의 경우 firebase.ts 파일 함수들을 정의해 두었습니다. fireProcess가 하는 기능을, setUser이 직접적으로 async await 함수가 되어 firebase api를 사용하려고 하려고 하면 에러가 나며 코드도 지저분해집니다.
  </div>
  </details>

```ts
//bad!!!!!!!!!!!!!!
setUser(async (prev) => {
  await setDoc(doc(db, 'projects', id), {
    ...newProject,
  });
});
```

set 함수 안에 firebase처리를 넣어서 처리한 이유는 아래 코드에서 볼 수 있듯이 element의 업데이트된 상태를 공유 할 수 있고, 프로젝트를 업데이트하는 과정을 파악하기 쉽기 때문입니다.(가독성이 좋음)

```ts
setProject((prev) => {
  const newBoards = { ...prev.contents };
  delete newBoards[`${boardKey}`];
  const newProject = { ...prev, contents: newBoards };
  const fireProcess = async () => {
    await updateProject(project.id, newProject);
  };
  fireProcess();
  return newProject;
});
```

> router 이동시 메모리 leak 에러

```
Warning: Can't perform a React state update on an unmounted component.
This is a no-op, but it indicates a memory leak in your application.
To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup
```

router 이동 후, 이동 전 컴포넌트에 state를 바꾸려는 시도를 했기 때문에 발생한 에러.

```ts
if (projectOnUrl === projectId) {
  //현재 보고 있는 프로젝트를 삭제 할 경우 다른 프로젝트(아래에 있는 프로젝트)로 이동하도록 url을 바꿔주는 과정에서 EditRemoveBox 컴포넌트의 상태를 바꾸려는 시도가 일어나 발생한 에러입니다.
  try {
    history.push(`/project/${user?.projects[deleteIndex + 1].id}`);
  } catch {
    if (user && user?.projects?.length === 1) history.push('/');
    else history.push(`/project/${user?.projects[deleteIndex - 1].id}`);
  }
}
```

```ts
useEffect(() => {
  // clean up!
  if (projectId !== projectOnUrl) return () => setDisplay(false);
}, []);
```
