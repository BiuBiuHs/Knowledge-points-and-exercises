const data = [
  { id: '01', name: '张大大', pid: '', job: '项目经理' },
  { id: '02', name: '小亮', pid: '01', job: '产品leader' },
  { id: '03', name: '小美', pid: '01', job: 'UIleader' },
  { id: '04', name: '老马', pid: '01', job: '技术leader' },
  { id: '05', name: '老王', pid: '01', job: '测试leader' },
  { id: '06', name: '老李', pid: '01', job: '运维leader' },
  { id: '07', name: '小丽', pid: '02', job: '产品经理' },
  { id: '08', name: '大光', pid: '02', job: '产品经理' },
  { id: '09', name: '小高', pid: '03', job: 'UI设计师' },
  { id: '10', name: '小刘', pid: '04', job: '前端工程师' },
  { id: '11', name: '小华', pid: '04', job: '后端工程师' },
  { id: '12', name: '小李', pid: '04', job: '后端工程师' },
  { id: '13', name: '小赵', pid: '05', job: '测试工程师' },
  { id: '14', name: '小强', pid: '05', job: '测试工程师' },
  { id: '15', name: '小涛', pid: '06', job: '运维工程师' }
];

const treeData = arrToTree(data);
console.log(treeData);

function arrToTree(data) {
  // tree来保存树形数组
  let tree = [];

  if (!Array.isArray(data)) {
    return tree;
  }

  data.forEach((ele) => {
    if (ele.pid === '') return tree.push(nodeObj(ele)); // 在树形数组上查找ele的父级节点对象
    const obj = getElementById(tree, ele.pid); // 如果找到了，添加到这个节点的children属性中
    obj && obj.children.push(nodeObj(ele));
  });

  return tree;
}

// 根据扁平数组对象生成树形数组中的节点对象
function nodeObj(obj) {
  return {
    id: obj.id,
    label: obj.name,
    children: [],
    job: obj.job
  };
}

// 通过ID，递归查找树形结构中的元素
function getElementById(arr, id) {
  for (const ele of arr) {
    if (ele.id === id) {
      return ele;
    } else if (ele.children.length > 0) {
      const temp = getElementById(ele.children, id);
      if (temp) {
        return temp;
      } else {
        continue;
      }
    }
  }
}
