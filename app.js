const $ = (x) => document.getElementById(x);
const todo = $("todo");

//Task elements
const taskName = $("taskName");
const taskPriority = $("taskPriority");
const taskSave = $("taskSave");

//CreateElement
function createElement({ tag = "", props = {}, children = [] }) {
  if (tag == "") {
    return document.createTextNode(children);
  } else {
    const element = document.createElement(tag);
    if (props)
      for (const prop in props) {
        if (prop === "function") {
          props[prop](element);
        } else {
          element.setAttribute(prop, props[prop]);
        }
      }
    if (children)
      if (typeof children === "string") {
        const child = createElement({ children });
        element.appendChild(child);
      } else {
        for (const child of children) {
          const _child = createElement(child);
          element.append(_child);
        }
      }
    return element;
  }
}
//CRUD
function CreateTask(name) {
  localStorage[name] = "";
}
function DeleteTask(name) {
  localStorage.removeItem(name);
}

//Running
function Message(text) {
  const element = createElement({
    tag: "small",
    props: { class: "msg-error" },
    children: text
  });
  const delay = setTimeout(() => {
    const parent = element.parentNode;
    parent.removeChild(element);
    clearTimeout(delay);
  }, 5000);
  return element;
}
taskSave.addEventListener("click", (e) => {
  if (!taskName.value) {
    const msg = Message("Task name is empty");
    taskName.parentNode.append(msg);
  } else {
    const newTask = createElement({
      tag: "div",
      props: { class: `prior-${taskPriority.value} box-task` },
      children: [
        {
          tag: "h2",
          props: { class: "title" },
          children: taskName.value
        },
        {
          tag: "button",
          props: {
            class: "close-btn",
            ["data-task"]: taskName.value
          },
          children: "x"
        },
        {
          tag: "ol",
          props: { class: "" },
          children: [
            {
              tag: "li",
              props: {},
              children: [
                {
                  tag: "input",
                  props: { type: "text", required: "", placeholder: "my task" }
                }
              ]
            }
          ]
        }
      ]
    });
    todo.prepend(newTask);
    CreateTask(taskName.value);
    taskName.value = "";
    taskPriority.value = "1";
  }
});

todo.addEventListener("click", (e) => {
  const id = e.target.dataset.task || e.target.dataset.search;
  if (!id) {
    return;
  }
  try {
    const element = e.target.parentNode;
    todo.removeChild(element);
    DeleteTask(id);
  } catch {
    const parent = e.target.parentNode.parentNode;
    const child = e.target.parentNode;
    parent.removeChild(child);
    parent.lastElementChild.firstElementChild.focus();
  }
});

todo.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    const input = e.target;
    const li = input.parentNode;
    const ol = input.parentNode.parentNode;
    if (!input.value) {
      const msg = Message("This field is not empty");
      li.append(msg);
      return;
    }
    const newTask = createElement({
      tag: "li",
      props: { ["data-taks"]: input.value },
      children: [
        { children: input.value },
        {
          tag: "button",
          props: { class: "close", ["data-search"]: "li" },
          children: "x"
        }
      ]
    });
    ol.removeChild(li);
    ol.append(newTask);
    ol.append(li);
    input.value = "";
    input.focus();
  }
});