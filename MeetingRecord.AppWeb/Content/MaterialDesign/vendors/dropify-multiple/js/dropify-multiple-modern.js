/**
 * dropify-multiple-modern.js
 * Enhanced version of dropify-multiple with modern UI
 * 
 * Based on original dropify by Jeremy FAGIS.
 * Multiple file support added by BrewEngage.
 * Modern UI enhancements added.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    root.DropifyMultipleModern = factory(root.jQuery);
  }
}(this, function ($) {
  'use strict';

  /**
   * Dropify Modern Class Definition
   */
  var DropifyMultipleModern = function (element, options) {
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      return;
    }

    var defaults = {
      defaultFile: '',
      maxFileSize: 0,
      minWidth: 0,
      maxWidth: 0,
      minHeight: 0,
      maxHeight: 0,
      showRemove: true,
      showLoader: true,
      showErrors: true,
      errorTimeout: 3000,
      errorsPosition: 'overlay',
      imgFileExtensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp'],
      maxFileSizePreview: '5M',
      allowedFormats: ['portrait', 'square', 'landscape'],
      allowedFileExtensions: ['*'],
      messages: {
        'default': 'Arrastra y suelta archivos aquí o haz clic',
        'replace': 'Arrastra y suelta o haz clic para reemplazar',
        'remove': 'Quitar',
        'error': 'Lo sentimos, ha ocurrido un error.',
        'fileCount': 'archivos seleccionados',
        'noFilesSelected': 'No se ha seleccionado ningún archivo'
      },
      error: {
        'fileSize': 'El tamaño del archivo es demasiado grande ({{ value }} máx).',
        'minWidth': 'El ancho de la imagen es demasiado pequeño ({{ value }}px mín).',
        'maxWidth': 'El ancho de la imagen es demasiado grande ({{ value }}px máx).',
        'minHeight': 'La altura de la imagen es demasiado pequeña ({{ value }}px mín).',
        'maxHeight': 'La altura de la imagen es demasiado grande ({{ value }}px máx).',
        'imageFormat': 'El formato de imagen no está permitido (solo {{ value }}).',
        'fileExtension': 'El archivo no está permitido (solo {{ value }}).'
      },
      tpl: {
        wrap: '<div class="dropify-wrapper"></div>',
        fileCounter: '<div class="dropify-file-counter">0 {{ fileCount }}</div>',
        uploadButton: '<button type="button" class="dropify-upload-btn"><i class="material-icons">file_upload</i> Elegir archivos</button>',
        loader: '<div class="dropify-loader"></div>',
        message: '<div class="dropify-message"><span class="file-icon"></span><p>{{ default }}</p></div>',
        emptyMessage: '<div class="dropify-empty-message"><span class="dropify-empty-icon material-icons">cloud_upload</span><p class="dropify-empty-text">{{ noFilesSelected }}</p></div>',
        preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"></div></div></div>',
        filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
        clearButton: '<button type="button" class="dropify-clear">×</button>',
        errorLine: '<p class="dropify-error">{{ error }}</p>',
        errorsContainer: '<div class="dropify-errors-container"><ul></ul></div>'
      }
    };

    this.element = element;
    this.input = $(this.element);
    this.wrapper = null;
    this.preview = null;
    this.fileCounter = null;
    this.uploadButton = null;
    this.filenameWrapper = null;
    this.settings = $.extend(true, defaults, options, this.input.data());
    this.files = [];
    this.errorsEvent = $.Event('dropify.errors');
    this.isDisabled = false;
    this.isInit = false;

    this.init();
  };

  /**
   * Init the plugin
   */
  DropifyMultipleModern.prototype.init = function () {
    this.isInit = true;
    this.createElements();
    this.setContainerSize();
    this.bindEvents();

    if (this.input.attr('disabled')) {
      this.isDisabled = true;
      this.wrapper.addClass('disabled');
    }

    let defaultFile = this.settings.defaultFile || '';
    if (defaultFile.trim() !== '') {
      this.setPreview(this.isImage(), defaultFile);
    }
  };

  /**
   * Create all necessary elements
   */
  DropifyMultipleModern.prototype.createElements = function () {
    // Wrap the input with the container
    this.input.wrap($(this.settings.tpl.wrap));
    this.wrapper = this.input.parent();

    // Add file counter
    if (this.settings.showFileCounter !== false) {
      this.fileCounter = $(this.settings.tpl.fileCounter.replace('{{ fileCount }}', this.settings.messages.fileCount));
      this.fileCounter.insertBefore(this.input);
    }

    // Add upload button
    if (this.settings.showUploadButton !== false) {
      this.uploadButton = $(this.settings.tpl.uploadButton);
      this.uploadButton.insertBefore(this.input);
    }

    // Add the message container
    var messageEl = $(this.settings.tpl.message.replace('{{ default }}', this.settings.messages.default));
    messageEl.insertBefore(this.input);

    // Add error message container
    if (this.settings.showErrors === true) {
      $(this.settings.tpl.errorLine.replace('{{ error }}', '')).appendTo(messageEl);
      
      // Create errors container according to errorsPosition option
      this.errorsContainer = $(this.settings.tpl.errorsContainer);
      
      if (this.settings.errorsPosition === 'outside') {
        this.errorsContainer.insertAfter(this.wrapper);
      } else {
        this.errorsContainer.insertBefore(this.input);
      }
    }

    // Add loader
    if (this.settings.showLoader === true) {
      this.loader = $(this.settings.tpl.loader);
      this.loader.insertBefore(this.input);
    }

    // Add the preview container
    this.preview = $(this.settings.tpl.preview);
    this.preview.insertAfter(this.input);

    // Add clear button
    if (this.isDisabled === false && this.settings.showRemove === true) {
      this.clearButton = $(this.settings.tpl.clearButton.replace('{{ remove }}', this.settings.messages.remove));
      this.clearButton.insertAfter(this.input);
      this.clearButton.on('click', this.clearElement.bind(this));
    }

    // Hide the native input
    this.input.hide();
  };

  /**
   * Set the container size
   */
  DropifyMultipleModern.prototype.setContainerSize = function () {
    if (this.settings.height) {
      this.wrapper.height(this.settings.height);
    }
  };

  /**
   * Bind all events
   */
  DropifyMultipleModern.prototype.bindEvents = function () {
    // Make the whole container clickable only if it's not disabled
    if (this.isDisabled === false) {
      // Click on the container or the upload button
      this.wrapper.on('click', this.clickHandler.bind(this));
      if (this.uploadButton) {
        this.uploadButton.on('click', this.clickHandler.bind(this));
      }
    }

    // Change on the input
    this.input.on('change', this.onChange.bind(this));
  };

  /**
   * Handle container click event
   */
  DropifyMultipleModern.prototype.clickHandler = function (event) {
    // If the target is not the remove button and not an element in preview
    if (
      !$(event.target).is(this.clearButton) && 
      !$(event.target).closest('.dropify-preview').length &&
      !$(event.target).closest('.dropify-multiple-file-item').length
    ) {
      // Trigger the file input
      this.input.trigger('click');
    }
  };

  /**
   * Handle file input change
   */
  DropifyMultipleModern.prototype.onChange = function () {
    // If the input has multiple attribute
    if (this.input.attr('multiple')) {
      this.handleMultipleFiles();
    } else {
      this.handleSingleFile();
    }
  };

  /**
   * Handle multiple files selection
   */
  DropifyMultipleModern.prototype.handleMultipleFiles = function () {
    if (this.input[0].files && this.input[0].files.length > 0) {
      this.files = [];
      this.clearErrors();
      this.showLoader();
      this.wrapper.removeClass('has-error');

      // Process each file
      for (let i = 0; i < this.input[0].files.length; i++) {
        const fileObj = this.input[0].files[i];
        
        // Store the file object
        this.files.push({
          object: fileObj,
          name: fileObj.name,
          size: fileObj.size,
          type: fileObj.type,
          width: null,
          height: null,
          isImage: this.isImageFile(fileObj.name)
        });
      }

      // Update UI
      this.updateFileCounter();
      this.setPreviewMultiple();
    } else {
      this.clearElement();
    }
  };

  /**
   * Handle single file selection
   */
  DropifyMultipleModern.prototype.handleSingleFile = function () {
    if (this.input[0].files && this.input[0].files[0]) {
      const file = this.input[0].files[0];
      this.files = [{
        object: file,
        name: file.name,
        size: file.size,
        type: file.type,
        width: null,
        height: null,
        isImage: this.isImageFile(file.name)
      }];
      
      this.clearErrors();
      this.showLoader();
      this.wrapper.removeClass('has-error');
      
      // Read the file
      if (this.isImageFile(file.name) && file.size < this.sizeToByte(this.settings.maxFileSizePreview)) {
        this.readImageFile(file);
      } else {
        this.setPreview(false);
      }
    } else {
      this.clearElement();
    }
  };

  /**
   * Read image file using FileReader
   * @param {File} file 
   */
  DropifyMultipleModern.prototype.readImageFile = function (file) {
    const reader = new FileReader();
    const image = new Image();
    const self = this;
    
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      image.src = event.target.result;
      image.onload = function () {
        // Set dimensions
        self.setFileDimensions(this.width, this.height);
        // Validate image
        self.validateImage();
        // Set preview
        self.setPreview(true, event.target.result);
      };
    };
  };

  /**
   * Update file counter
   */
  DropifyMultipleModern.prototype.updateFileCounter = function () {
    if (this.fileCounter) {
      const count = this.files.length;
      this.fileCounter.html(count + ' ' + this.settings.messages.fileCount);
    }
  };

  /**
   * Set the preview for multiple files
   */
  DropifyMultipleModern.prototype.setPreviewMultiple = function () {
    this.wrapper.addClass('has-preview');
    
    // Clear previous preview
    const render = this.preview.children('.dropify-render');
    render.html('<div class="dropify-multiple-files"></div>');
    
    // Add each file to the preview
    const $filesContainer = render.find('.dropify-multiple-files');
    
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      const extension = this.getFileExtension(file.name);
      const iconSrc = this.getFileIcon(extension);
      const fileSize = this.formatFileSize(file.size);
      
      const $fileItem = $('<div class="dropify-multiple-file-item" data-index="' + i + '">' +
        '<img src="' + iconSrc + '" alt="' + extension + '">' +
        '<div class="dropify-multiple-file-info">' +
          '<div class="dropify-multiple-file-name">' + file.name + '</div>' +
          '<div class="dropify-multiple-file-size">' + fileSize + '</div>' +
        '</div>' +
        '<button type="button" class="dropify-multiple-file-remove">×</button>' +
      '</div>');
      
      $filesContainer.append($fileItem);
    }
    
    // Hide loader
    this.hideLoader();
    
    // Add remove event for individual files
    this.addRemoveFileEvents();
    
    // Show the preview
    this.preview.fadeIn();
  };

  /**
   * Add remove events for individual file items
   */
  DropifyMultipleModern.prototype.addRemoveFileEvents = function () {
    const self = this;
    this.preview.find('.dropify-multiple-file-remove').on('click', function (e) {
      e.stopPropagation();
      const $item = $(this).closest('.dropify-multiple-file-item');
      const index = parseInt($item.attr('data-index'), 10);
      
      // Remove the file from the array
      self.files.splice(index, 1);
      
      // Update file counter
      self.updateFileCounter();
      
      // If no files left, clear element
      if (self.files.length === 0) {
        self.clearElement();
      } else {
        // Otherwise, refresh preview
        self.setPreviewMultiple();
      }
    });
  };

  /**
   * Set the preview for a single file
   * @param {boolean} isImage 
   * @param {string} src 
   */
  DropifyMultipleModern.prototype.setPreview = function (isImage, src) {
    this.wrapper.addClass('has-preview');
    
    const render = this.preview.children('.dropify-render');
    
    // Clear previous preview
    render.html('');
    
    if (isImage) {
      // Create image preview
      const $img = $('<img src="' + src + '" />');
      
      if (this.settings.height) {
        $img.css('max-height', this.settings.height);
      }
      
      $img.appendTo(render);
    } else if (this.files.length > 0) {
      // Create file icon preview
      const file = this.files[0];
      const extension = this.getFileExtension(file.name);
      
      $('<i />').attr('class', 'dropify-font-file').appendTo(render);
      $('<span class="dropify-extension" />').html(extension).appendTo(render);
    }
    
    // Hide loader
    this.hideLoader();
    
    // Show the preview
    this.preview.fadeIn();
  };

  /**
   * Reset the preview
   */
  DropifyMultipleModern.prototype.resetPreview = function () {
    this.wrapper.removeClass('has-preview');
    const render = this.preview.children('.dropify-render');
    render.find('.dropify-extension').remove();
    render.find('i').remove();
    render.find('img').remove();
    render.find('.dropify-multiple-files').remove();
    this.preview.hide();
    this.hideLoader();
  };

  /**
   * Clear the element
   */
  DropifyMultipleModern.prototype.clearElement = function () {
    this.files = [];
    this.resetPreview();
    this.input.val('');
    this.updateFileCounter();
    this.wrapper.removeClass('has-error');
    
    // Show empty message if it exists
    if (this.settings.tpl.emptyMessage) {
      const emptyMessage = $(this.settings.tpl.emptyMessage
        .replace('{{ noFilesSelected }}', this.settings.messages.noFilesSelected));
        
      this.preview.children('.dropify-render').html(emptyMessage);
      this.preview.show();
    }
  };

  /**
   * Check if a file is an image
   * @param {string} filename 
   * @returns {boolean}
   */
  DropifyMultipleModern.prototype.isImageFile = function (filename) {
    const extension = this.getFileExtension(filename);
    return this.settings.imgFileExtensions.indexOf(extension) !== -1;
  };

  /**
   * Get file extension
   * @param {string} filename 
   * @returns {string}
   */
  DropifyMultipleModern.prototype.getFileExtension = function (filename) {
    return filename.split('.').pop().toLowerCase();
  };

  /**
   * Get appropriate icon for file type
   * @param {string} extension 
   * @returns {string}
   */
  DropifyMultipleModern.prototype.getFileIcon = function (extension) {
    // You should implement this to return appropriate icons
    // Here's a simple approach using Material Design Icons or similar
    let iconPath;
    
    switch(extension) {
      case 'pdf':
        iconPath = '/Content/MeetingRecordAppWeb/iconfile/ic_pdf.svg';
        break;
      case 'doc':
      case 'docx':
        iconPath = '/Content/MeetingRecordAppWeb/iconfile/ic_word.svg';
        break;
      case 'xls':
      case 'xlsx':
        iconPath = '/Content/MeetingRecordAppWeb/iconfile/ic_excel.svg';
        break;
      case 'ppt':
      case 'pptx':
        iconPath = '/Content/MeetingRecordAppWeb/iconfile/ic_powerpoint.svg';
        break;
      case 'zip':
      case 'rar':
      case '7z':
        iconPath = '/Content/MeetingRecordAppWeb/iconfile/ic_zip.svg';
        break;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
        iconPath = '/Content/MeetingRecordAppWeb/iconfile/ic_image.svg';
        break;
      default:
        iconPath = '/Content/MeetingRecordAppWeb/iconfile/ic_file.svg';
    }
    
    return iconPath;
  };

  /**
   * Set file dimensions
   * @param {number} width 
   * @param {number} height 
   */
  DropifyMultipleModern.prototype.setFileDimensions = function (width, height) {
    if (this.files.length > 0) {
      this.files[0].width = width;
      this.files[0].height = height;
    }
  };

  /**
   * Validate image
   */
  DropifyMultipleModern.prototype.validateImage = function () {
    // Check file size
    this.checkFileSize();
    
    // Check image dimensions
    if (this.files.length > 0) {
      const file = this.files[0];
      
      if (this.settings.minWidth !== 0 && this.settings.minWidth >= file.width) {
        this.pushError('minWidth');
      }
      
      if (this.settings.maxWidth !== 0 && this.settings.maxWidth <= file.width) {
        this.pushError('maxWidth');
      }
      
      if (this.settings.minHeight !== 0 && this.settings.minHeight >= file.height) {
        this.pushError('minHeight');
      }
      
      if (this.settings.maxHeight !== 0 && this.settings.maxHeight <= file.height) {
        this.pushError('maxHeight');
      }
      
      // Check image format
      if (this.settings.allowedFormats.indexOf(this.getImageFormat()) === -1) {
        this.pushError('imageFormat');
      }
    }
  };

  /**
   * Get image format (landscape, portrait, square)
   * @returns {string}
   */
  DropifyMultipleModern.prototype.getImageFormat = function () {
    if (this.files.length > 0) {
      const file = this.files[0];
      
      if (file.width === file.height) {
        return 'square';
      }
      
      return file.width < file.height ? 'portrait' : 'landscape';
    }
    
    return '';
  };

  /**
   * Check file size
   */
  DropifyMultipleModern.prototype.checkFileSize = function () {
    if (this.settings.maxFileSize !== 0 && this.files.length > 0) {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].size > this.sizeToByte(this.settings.maxFileSize)) {
          this.pushError('fileSize');
          break;
        }
      }
    }
  };
  
  /**
   * Format file size
   * @param {number} size - Size in bytes
   * @returns {string}
   */
  DropifyMultipleModern.prototype.formatFileSize = function (size) {
    if (size === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Convert size to bytes
   * @param {string} size - Size with unit (e.g., "5M")
   * @returns {number}
   */
  DropifyMultipleModern.prototype.sizeToByte = function (size) {
    let value = 0;
    
    if (size !== 0) {
      const unit = size.slice(-1).toUpperCase();
      const kb = 1024;
      const mb = 1024 * kb;
      const gb = 1024 * mb;
      
      value = parseFloat(size) * (
        unit === 'K' ? kb : (
          unit === 'M' ? mb : (
            unit === 'G' ? gb : 0
          )
        )
      );
    }
    
    return value;
  };

  /**
   * Push error
   * @param {string} errorCode 
   */
  DropifyMultipleModern.prototype.pushError = function (errorCode) {
    const event = $.Event('dropify.error.' + errorCode);
    this.errorsEvent.errors.push(event);
    this.input.trigger(event, [this]);
  };

  /**
   * Clear errors
   */
  DropifyMultipleModern.prototype.clearErrors = function () {
    if (typeof this.errorsContainer !== 'undefined') {
      this.errorsContainer.children('ul').html('');
    }
  };

  /**
   * Show error
   * @param {string} errorCode 
   */
  DropifyMultipleModern.prototype.showError = function (errorCode) {
    if (typeof this.errorsContainer !== 'undefined') {
      this.errorsContainer.children('ul')
        .append('<li>' + this.getError(errorCode) + '</li>');
    }
  };

  /**
   * Get error message
   * @param {string} errorCode 
   * @returns {string}
   */
  DropifyMultipleModern.prototype.getError = function (errorCode) {
    let error = this.settings.error[errorCode];
    let value = '';
    
    switch (errorCode) {
      case 'fileSize':
        value = this.settings.maxFileSize;
        break;
      case 'minWidth':
        value = this.settings.minWidth;
        break;
      case 'maxWidth':
        value = this.settings.maxWidth;
        break;
      case 'minHeight':
        value = this.settings.minHeight;
        break;
      case 'maxHeight':
        value = this.settings.maxHeight;
        break;
      case 'imageFormat':
        value = this.settings.allowedFormats.join(', ');
        break;
      case 'fileExtension':
        value = this.settings.allowedFileExtensions.join(', ');
        break;
    }
    
    if (value !== '') {
      return error.replace('{{ value }}', value);
    }
    
    return error;
  };

  /**
   * Show loader
   */
  DropifyMultipleModern.prototype.showLoader = function () {
    if (typeof this.loader !== 'undefined') {
      this.loader.show();
    }
  };

  /**
   * Hide loader
   */
  DropifyMultipleModern.prototype.hideLoader = function () {
    if (typeof this.loader !== 'undefined') {
      this.loader.hide();
    }
  };

  /**
   * Destroy plugin
   */
  DropifyMultipleModern.prototype.destroy = function () {
    this.input.siblings().remove();
    this.input.unwrap();
    this.isInit = false;
  };

  /**
   * jQuery Plugin Definition
   */
  $.fn.dropifyMultipleModern = function(options) {
    return this.each(function() {
      if (!$.data(this, "dropifyMultipleModern")) {
        $.data(this, "dropifyMultipleModern", new DropifyMultipleModern(this, options));
      }
    });
  };

  return DropifyMultipleModern;
}));
