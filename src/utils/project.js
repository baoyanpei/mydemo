//通过GroupID查找group信息
export function getGroupFromGroupsByGroupID(group_list, group_id) {
  console.log(group_list, group_id)
  const rootGroup = group_list.group
  if (rootGroup !== undefined && rootGroup.length > 0) {
    // rootGroup.forEach(item1 => {
    for (var item1 of rootGroup) {
      console.log('item1', item1, item1.id === group_id)
      if (item1.id === group_id) {
        return item1
        
      }
      if (item1.group !== undefined && item1.group.length > 0) {
        // item1.group.forEach(item2 => {
        for (var item2 of item1.group) {
          if (item2.id === group_id) {
            return item2
          }
        }
      }

    };
  }
}
