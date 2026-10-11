// 共通生成器が渡す親子関係と表示用の木を，診断・データで共用する．
function appendContent(document, parent, content) {
  if (content.kind === 'text') {
    const p = document.createElement('p');
    p.className = 'common-value'; p.textContent = content.text; parent.append(p);
  } else if (content.kind === 'list') {
    const list = document.createElement('ul'); list.className = 'common-value-list';
    for (const child of content.children) {
      const li = document.createElement('li'); appendContent(document, li, child); list.append(li);
    }
    parent.append(list);
  } else if (content.kind === 'fields') {
    if (content.heading) {
      const heading = document.createElement('p'); heading.className = 'common-step-title';
      heading.textContent = content.heading; parent.append(heading);
    }
    const fields = document.createElement('dl'); fields.className = 'common-value-fields';
    for (const entry of content.entries) {
      const field = document.createElement('div'); field.className = 'common-value-field';
      const label = document.createElement('dt'); label.textContent = entry.label;
      const value = document.createElement('dd'); appendContent(document, value, entry.content);
      field.append(label, value); fields.append(field);
    }
    parent.append(fields);
  }
}

function groupFold(document, group, className) {
  const fold = document.createElement('details'); fold.className = className + ' common-item-group';
  const summary = document.createElement('summary'); summary.textContent = group.label; fold.append(summary);
  let category = '', subgroup = '';
  for (const row of group.rows) {
    if (row.category !== category) {
      category = row.category; subgroup = '';
      const title = document.createElement('h4'); title.textContent = category; fold.append(title);
    }
    if (row.subgroup && row.subgroup !== subgroup) {
      subgroup = row.subgroup;
      const title = document.createElement('h5'); title.textContent = subgroup; fold.append(title);
    }
    const item = document.createElement('div'); item.className = 'common-item';
    if (row.display_content) {
      if (row.item !== row.subgroup && row.item !== row.category) {
        const title = document.createElement('h6'); title.textContent = row.item; item.append(title);
      }
      appendContent(document, item, row.display_content);
    } else {
      const p = document.createElement('p'); p.className = 'common-value';
      p.textContent = row.display_text; item.append(p);
    }
    fold.append(item);
  }
  return fold;
}

export function appendCommonItemGroups(document, parent, groups, className = 'data-branch-detail') {
  const additionsByParent = new Map();
  const equipmentById = new Map();
  for (const group of groups) {
    if (group.group_kind === 'addition' || group.group_kind === 'rate_addition') {
      const key = group.parent_group_id;
      if (!additionsByParent.has(key)) {
        const fold = document.createElement('details');
        fold.className = className + ' common-item-group common-additions';
        const summary = document.createElement('summary'); summary.textContent = '加算'; fold.append(summary);
        additionsByParent.set(key, fold); (equipmentById.get(key) ?? parent).append(fold);
      }
      additionsByParent.get(key).append(groupFold(document, group, className));
    } else {
      const fold = groupFold(document, group, className);
      parent.append(fold);
      if (group.group_kind === 'equipment') equipmentById.set(group.group_id, fold);
    }
  }
}
