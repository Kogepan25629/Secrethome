import axios from "axios";
import SecretParkLayout from "components/layout/secretParkLayout";
import EditContentForm from "components/secret/park/EditContentForm";
import { NextPage } from "next";
import Router from "next/router";
import { useEffect, useRef, useState } from "react";
import css from "styles/pages/secret/park/admin/add_content.module.scss"

const AddContent: NextPage = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [movie, setMovie] = useState<File | null>(null)
  const [isEnableSubmit, setIsEnableSubmit] = useState<boolean>(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isEnableSaveImage, setIsEnableSaveImage] = useState(false)
  const [movieBlob, setMovieBlob] = useState("")
  const [imageBlob, setImageBlob] = useState("")

  useEffect(() => {
    if (title != "" && description != "" && movie != null && imageBlob != "") {
      setIsEnableSubmit(true)
    } else {
      setIsEnableSubmit(false)
    }
  }, [title, description, movie, imageBlob])

  useEffect(() => {
    if (movie) {
      setMovieBlob(URL.createObjectURL(movie))
    }
  }, [movie])

  const handleChangeTitle = (event: any) => {
    setTitle(event.target.value)
  }

  const handleChangeDescription = (event: any) => {
    setDescription(event.target.value)
  }

  const handleChangeMovie = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      setMovie(event.target.files[0])
    }
  }

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files)
    if (event.target.files != null && event.target.files[0] != null) {
      const _img = new Image();
      _img.onload = () => {
        const canvas  = document.createElement('canvas')
        canvas.width  = _img.naturalWidth
        canvas.height = _img.naturalHeight
        canvas.getContext('2d')!.drawImage(_img, 0, 0, _img.naturalWidth, _img.naturalHeight)
        setImageBlob(canvas.toDataURL("image/webp"))
      }
      _img.src = URL.createObjectURL(event.target.files[0])
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()

    const file = new FormData();
    file.append("title", title)
    file.append("description", description)
    file.append("movie", movie!)
    file.append("image", imageBlob)
    console.log(movie)
    axios.post("/api/secret/park/add_content", file, {headers: {'content-type': 'multipart/form-data',}, onUploadProgress}).then(res => {
      console.log(res.data.result)
    })
  }

  const onUploadProgress = (progressEvent: any) => {
    console.log(progressEvent)
  }

  const onStopVideo = () => {
    setIsEnableSaveImage(true)
  }

  const onPlayingVideo = () => {
    setIsEnableSaveImage(false)
  }

  const saveImageFromVideo = () => {
    if (!videoRef.current) {
      return
    }
    const canvas  = document.createElement('canvas')
    canvas.width  = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d')!.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight)
    console.log(videoRef.current.width)

    setImageBlob(canvas.toDataURL("image/webp"))
  }

  return (
    <SecretParkLayout>
      <div>
        <EditContentForm></EditContentForm>
      </div>
    </SecretParkLayout>
  )

  return (
    <SecretParkLayout>
      <div>
        <form className={css.form} onSubmit={handleSubmit}>
          <div>
            <p>タイトル</p>
            <input spellCheck="false" autoComplete="off" type={"text"} name={"title"} value={title} className={css.input_title} onChange={handleChangeTitle}></input>
          </div>
          <div>
            <p>説明</p>
            <input spellCheck="false" autoComplete="off" type={"text"} name={"description"} value={description} className={css.input_description} onChange={handleChangeDescription}></input>
          </div>
          <div>
            <p>動画ファイル(mp4)</p>
            <input type="file" accept=".mp4" className={css.input_file} onChange={handleChangeMovie}></input>
          </div>
          <div className={css.video_div}>
            <video src={movieBlob} controls ref={videoRef} onPause={onStopVideo} onSeeked={onStopVideo} onPlay={onPlayingVideo} onSeeking={onPlayingVideo}></video>
          </div>
          <div>
            <input type="file" accept="image/*" onChange={handleChangeImage}></input>
            <button disabled={!isEnableSaveImage} onClick={saveImageFromVideo}>動画からセーブ</button>
          </div>
          <div className={css.image_div}>
            <img src={imageBlob}></img>
          </div>
          <div>
            <input type="submit" disabled={!isEnableSubmit}></input>
          </div>
        </form>
      </div>
    </SecretParkLayout>
  )
}

export default AddContent

export async function getStaticProps() {
  return {
    props: {
    },
  }
}