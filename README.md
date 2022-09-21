# Yanban Note 프로젝트✅

### 구현 결과

![Hnet com-image (1)](https://user-images.githubusercontent.com/74299317/165036437-ea304779-f017-4473-82fc-3fa388edc29b.gif)

🏠 사이트 주소
https://yanban-note.netlify.app/

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
- 로그인/회원가입..

> **server**

- firebase Auth
- firebase Cloud Firestore
- onSnapshot

---

### 👨‍💻 프로젝트 Issues

> #### optimistic ui

board나 task를 옮기는 과정에서 firebase의 database가 업데이트 되는 것을 기다리면 옮긴 것이 바로 적용되지 않음
따라서, db 업데이트 전에 state를 set해둠.

```ts
//board 위치 바꾸기
if (type === 'column') {
  const newOrder = Array.from(project.boardsOrder);
  newOrder.splice(source.index, 1);
  newOrder.splice(destination.index, 0, draggableId);

  const newProject: IProject = { ...project, boardsOrder: newOrder };
  //optimistic ui
  setProject(newProject);
  const updateBoardsOrder = async () => updateProject(projectId, newProject);
  updateBoardsOrder();
}
```

<br/>
<br/>

> #### 📜router 이동시 메모리 leak 에러

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

해결 코드

```ts
useEffect(() => {
  // clean up!
  if (projectId !== projectOnUrl) return () => setDisplay(false);
}, []);
```

<br/>
<br/>

> #### 📜event.stopPropagation()

모달 외부 클릭 시 모달이 닫히게 하는 방법으로 사용. 부모의 영역을 화면 전체로 하고 자식 영역에서 발생하는 이벤트 버블링을 방지.

```ts
    ...
      <div onClick={stopPropagation} style={style}>
        ....
    ...
```

<br/>
<br/>

> #### 📜max-content/min width

- max-content 속성
  보드들이 내부에 task를 추가하면서 독립적으로 컨텐츠 크기에 딱 맞춰서 커질 수 있도록 하기 위해 사용.

- min-width 속성
  왼쪽 사이드바가 프로젝트 내부 보드가 늘어나거나 브라우저를 좁히는 것과 상관없이 너비가 유지 되도록 하기 위해 사용

---

### ❗ 0.2.0 변경사항

1. 배포 환경 → netlify 그대로
2. 기술 스택

➖ styled-components

➕ emotion (MUI5 도입으로 인함)

➕ MUI5

3. 추가 기능 **오답 노트 서비스로 리팩토링 할 것임**
........