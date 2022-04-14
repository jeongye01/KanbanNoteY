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

```
.
+ --  REadm
console.log(dafe;)
```

| header | description |
| -----: | ----------: |
|  cell1 |       cell2 |

| header | description |
| :----- | :---------: |
| cell1  |    cell2    |

`console.log('your message')`

github flavored markdown=>다양한 문법들 있음

todo
-[]adf
-[]asdf
