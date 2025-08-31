import React from 'react'
import { getTags } from '@/lib/actions/tag.actions'


const Tags = async () => {
  const { success, data, error } = await getTags({
    page: 1,
    pageSize: 10,
   query:"javascript"
  });

  const {tags} = data || {};
  console.log(tags);
  return (
    <div>Tags</div>
  );
}

export default Tags