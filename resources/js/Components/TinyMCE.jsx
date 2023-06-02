import { Editor } from '@tinymce/tinymce-react'

// TinyMCE so the global var exists
// eslint-disable-next-line no-unused-vars
import tinymce from 'tinymce/tinymce'
// DOM model
import 'tinymce/models/dom/model'
// Theme
import 'tinymce/themes/silver'
// Toolbar icons
import 'tinymce/icons/default'
// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css'

// importing the plugin js.
// if you use a plugin that is not listed here the editor will fail to load
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/help'
import 'tinymce/plugins/image'
import 'tinymce/plugins/importcss'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'
import 'tinymce/plugins/template'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'

// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis'

// Content styles, including inline UI like fake cursors
/* eslint import/no-webpack-loader-syntax: off */
import contentCss from 'tinymce/skins/content/default/content.min.css?inline'
import contentUiCss from 'tinymce/skins/ui/oxide/content.min.css?inline'

import generalCss from '../../css/app.css?inline'

import { usePage } from '@inertiajs/react'

export default function BundledEditor(props) {
    const { init, ...rest } = props
    const { csrf_token } = usePage().props

    const FilePickerCallback = async (callback, value, meta) => {
        // Provide file and text for the link dialog
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*,video/*')

        input.addEventListener('change', async (e) => {
            const body = new FormData()
            body.append('_token', csrf_token)
            body.append('image', e.target.files[0])

            await fetch(route('post.upload'), {
                method: 'post',
                body: body,
                headers: {
                    'accept-content': 'application/json',
                    'X-CSSRF-TOKEN': csrf_token,
                },
                credentials: 'include',
            })
                .then((res) => res.json())
                .then((res) => {
                    callback(res.url, { alt: 'My alt text' })
                })
                .catch((err) => {
                    alert(err)
                })
        })

        input.click()
    }

    const ImageUploadHandler = (blobInfo, progress) =>
        new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.withCredentials = true
            xhr.open('POST', route('post.upload'))

            xhr.upload.onprogress = (e) => {
                progress((e.loaded / e.total) * 100)
            }

            xhr.onload = () => {
                if (xhr.status === 403) {
                    reject({
                        message: 'HTTP Error: ' + xhr.status,
                        remove: true,
                    })
                    return
                }

                if (xhr.status < 200 || xhr.status >= 300) {
                    reject('HTTP Error: ' + xhr.status)
                    return
                }

                const json = JSON.parse(xhr.responseText)

                if (!json || typeof json.url != 'string') {
                    reject('Invalid JSON: ' + xhr.responseText)
                    return
                }

                resolve(json.url)
            }

            xhr.onerror = () => {
                reject(
                    'Image upload failed due to a XHR Transport error. Code: ' +
                        xhr.status
                )
            }

            const formData = new FormData()
            formData.append('_token', csrf_token)
            formData.append('image', blobInfo.blob(), blobInfo.filename())

            xhr.send(formData)
        })

    // note that skin and content_css is disabled to avoid the normal
    // loading process and is instead loaded as a string via content_style
    return (
        <Editor
            init={{
                ...init,
                file_picker_callback: FilePickerCallback,
                images_upload_handler: ImageUploadHandler,
                promotion: false,
                image_caption: true,
                image_advtab: true,
                object_resizing: true,
                skin: false,
                content_css: false,
                content_style: [contentCss, contentUiCss, generalCss].join(
                    '\n'
                ),
                importcss_append: true,
            }}
            {...rest}
        />
    )
}
