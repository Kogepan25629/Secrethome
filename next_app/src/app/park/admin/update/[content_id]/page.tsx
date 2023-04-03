import { DB } from 'util/sql'
import { getContentTagsData, TagData } from 'util/secret/park/tags'

import UpdateContentForm from 'features/admin/components/edit/UpdateContentForm'

type ContentData = {
  id?: string
  title?: string
  description?: string
  updatedAt?: string
  selectedTags: TagData[]
}

const getContentData = async (contentID: string): Promise<ContentData> => {
  let result = await DB.query<any[]>(`select title, description, updated_at from park_contents where id='${contentID}'`)
  if (result.length == 0) {
    return { selectedTags: [] }
  } else {
    return {
      id: contentID,
      title: result[0].title,
      description: result[0].description,
      updatedAt: result[0].updated_at,
      selectedTags: await getContentTagsData(contentID),
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
      />
    </div>
  )
}

export default UpdateContent
