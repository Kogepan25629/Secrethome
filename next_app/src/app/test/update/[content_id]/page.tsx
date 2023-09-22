import { DB } from 'util/sql'
import { getContentTagsData, TagData } from 'util/secret/park/tags'

import ContentDeleteButton from 'features/admin/components/edit/ContentDeleteButton'
import UpdateContentForm from 'features/admin/components/edit/UpdateContentForm'

type ContentData = {
  id?: string
  title?: string
  description?: string
  updatedAt?: string
  selectedTags: TagData[]
}

const getContentData = async (contentID: any): Promise<ContentData> => {
  const [rows, _] = await DB.query<any[]>(`select title, description, updated_at from park_contents where id=?`, [contentID])
  const data = JSON.parse(JSON.stringify(rows)) as any[]
  if (data.length == 0) {
    return { selectedTags: [] }
  } else {
    return {
      id: contentID as string,
      title: data[0].title,
      description: data[0].description,
      updatedAt: data[0].updated_at,
      selectedTags: await getContentTagsData(contentID as string),
    }
  }
}

const UpdateContent = async ({ params }: { params: any }) => {
  const contentData = await getContentData(params.content_id)
  if (contentData.id == undefined) {
    return <p>No content</p>
  }

  return (
    <div>
      <UpdateContentForm
        id={contentData.id}
        title={contentData.title ?? ''}
        description={contentData.description ?? ''}
        updatedAt={contentData.updatedAt ?? ''}
        selectedTagList={contentData.selectedTags ?? []}
      ></UpdateContentForm>
      <ContentDeleteButton contentID={contentData.id} />
    </div>
  )
}

export default UpdateContent
