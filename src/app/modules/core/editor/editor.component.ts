import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnChanges {
  @Output() exportContent = new EventEmitter();
  @Input() content: string;
  @Input() type: string;
  tinyConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    branding: false,
    height: 150,
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount image imagetools table'
    ],
    toolbar:
      'formatselect | bold italic backcolor | \
       alignleft aligncenter alignright alignjustify | \
       bullist numlist outdent indent | image | table tabledelete | tableprops tablerowprops tablecellprops | \
       tableinsertrowbefore tableinsertrowafter tabledeleterow | \
       tableinsertcolbefore tableinsertcolafter tabledeletecol | removeformat',
    language: 'vi',
    language_url: '/assets/langs/vi.js',
    images_upload_url: 'postAcceptor.php',
    images_upload_handler: this.example_image_upload_handler,
    setup: (editor: any) => {
      editor.on('init', () => {
        this.editor = editor;
        if (this.content) {
          editor.setContent(this.content);
        }
      });
      editor.on('blur', () => {
        this.exportContent.emit(editor.getContent());
      });
    },
  }
  editor: any;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.editor) {
      this.editor.setContent(changes.content.currentValue);
    }
  }

  ngOnInit(): void {
    if (this.type === 'comment') {
      this.tinyConfig.menubar = false;
      this.tinyConfig.toolbar = 'bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist | image '
    }
  }

  example_image_upload_handler(blobInfo, success, failure, progress) {
    var xhr, formData;

    xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', 'postAcceptor.php');
    xhr.setRequestHeader('Authorization', 'Bearer hefiafizepzgenozngopzngpzegn');

    xhr.upload.onprogress = function (e) {
      progress(e.loaded / e.total * 100);
    };

    xhr.onload = function () {
      var json;

      if (xhr.status === 403) {
        failure('HTTP Error: ' + xhr.status, { remove: true });
        return;
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        failure('HTTP Error: ' + xhr.status);
        return;
      }

      json = JSON.parse(xhr.responseText);

      if (!json || typeof json.location != 'string') {
        failure('Invalid JSON: ' + xhr.responseText);
        return;
      }

      success(json.location);
    };

    xhr.onerror = function () {
      failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
    };

    formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
  };

}
