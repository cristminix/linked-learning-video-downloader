"use strict";
(() => {
  // node_modules/@tauri-apps/api/tslib.es6-9bc0804d.js
  var t = function(n7, r7) {
    return t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t2, n8) {
      t2.__proto__ = n8;
    } || function(t2, n8) {
      for (var r8 in n8)
        Object.prototype.hasOwnProperty.call(n8, r8) && (t2[r8] = n8[r8]);
    }, t(n7, r7);
  };
  function n(n7, r7) {
    if ("function" != typeof r7 && null !== r7)
      throw new TypeError("Class extends value " + String(r7) + " is not a constructor or null");
    function e6() {
      this.constructor = n7;
    }
    t(n7, r7), n7.prototype = null === r7 ? Object.create(r7) : (e6.prototype = r7.prototype, new e6());
  }
  var r = function() {
    return r = Object.assign || function(t2) {
      for (var n7, r7 = 1, e6 = arguments.length; r7 < e6; r7++)
        for (var o14 in n7 = arguments[r7])
          Object.prototype.hasOwnProperty.call(n7, o14) && (t2[o14] = n7[o14]);
      return t2;
    }, r.apply(this, arguments);
  };
  function o(t2, n7, r7, e6) {
    return new (r7 || (r7 = Promise))(function(o14, a12) {
      function c11(t3) {
        try {
          i9(e6.next(t3));
        } catch (t4) {
          a12(t4);
        }
      }
      function l4(t3) {
        try {
          i9(e6.throw(t3));
        } catch (t4) {
          a12(t4);
        }
      }
      function i9(t3) {
        var n8;
        t3.done ? o14(t3.value) : (n8 = t3.value, n8 instanceof r7 ? n8 : new r7(function(t4) {
          t4(n8);
        })).then(c11, l4);
      }
      i9((e6 = e6.apply(t2, n7 || [])).next());
    });
  }
  function a(t2, n7) {
    var r7, e6, o14, a12, c11 = { label: 0, sent: function() {
      if (1 & o14[0])
        throw o14[1];
      return o14[1];
    }, trys: [], ops: [] };
    return a12 = { next: l4(0), throw: l4(1), return: l4(2) }, "function" == typeof Symbol && (a12[Symbol.iterator] = function() {
      return this;
    }), a12;
    function l4(a13) {
      return function(l5) {
        return function(a14) {
          if (r7)
            throw new TypeError("Generator is already executing.");
          for (; c11; )
            try {
              if (r7 = 1, e6 && (o14 = 2 & a14[0] ? e6.return : a14[0] ? e6.throw || ((o14 = e6.return) && o14.call(e6), 0) : e6.next) && !(o14 = o14.call(e6, a14[1])).done)
                return o14;
              switch (e6 = 0, o14 && (a14 = [2 & a14[0], o14.value]), a14[0]) {
                case 0:
                case 1:
                  o14 = a14;
                  break;
                case 4:
                  return c11.label++, { value: a14[1], done: false };
                case 5:
                  c11.label++, e6 = a14[1], a14 = [0];
                  continue;
                case 7:
                  a14 = c11.ops.pop(), c11.trys.pop();
                  continue;
                default:
                  if (!(o14 = c11.trys, (o14 = o14.length > 0 && o14[o14.length - 1]) || 6 !== a14[0] && 2 !== a14[0])) {
                    c11 = 0;
                    continue;
                  }
                  if (3 === a14[0] && (!o14 || a14[1] > o14[0] && a14[1] < o14[3])) {
                    c11.label = a14[1];
                    break;
                  }
                  if (6 === a14[0] && c11.label < o14[1]) {
                    c11.label = o14[1], o14 = a14;
                    break;
                  }
                  if (o14 && c11.label < o14[2]) {
                    c11.label = o14[2], c11.ops.push(a14);
                    break;
                  }
                  o14[2] && c11.ops.pop(), c11.trys.pop();
                  continue;
              }
              a14 = n7.call(t2, c11);
            } catch (t3) {
              a14 = [6, t3], e6 = 0;
            } finally {
              r7 = o14 = 0;
            }
          if (5 & a14[0])
            throw a14[1];
          return { value: a14[0] ? a14[1] : void 0, done: true };
        }([a13, l5]);
      };
    }
  }

  // node_modules/@tauri-apps/api/tauri-a4b3335a.js
  function o2(n7, t2) {
    void 0 === t2 && (t2 = false);
    var e6 = window.crypto.getRandomValues(new Uint32Array(1))[0], o14 = "_".concat(e6);
    return Object.defineProperty(window, o14, { value: function(e7) {
      return t2 && Reflect.deleteProperty(window, o14), null == n7 ? void 0 : n7(e7);
    }, writable: false, configurable: true }), e6;
  }
  function r2(r7, c11) {
    return void 0 === c11 && (c11 = {}), o(this, void 0, void 0, function() {
      return a(this, function(n7) {
        return [2, new Promise(function(n8, t2) {
          var i9 = o2(function(t3) {
            n8(t3), Reflect.deleteProperty(window, "_".concat(a12));
          }, true), a12 = o2(function(n9) {
            t2(n9), Reflect.deleteProperty(window, "_".concat(i9));
          }, true);
          window.__TAURI_IPC__(r({ cmd: r7, callback: i9, error: a12 }, c11));
        })];
      });
    });
  }
  function c(n7, t2) {
    void 0 === t2 && (t2 = "asset");
    var e6 = encodeURIComponent(n7);
    return navigator.userAgent.includes("Windows") ? "https://".concat(t2, ".localhost/").concat(e6) : "".concat(t2, "://").concat(e6);
  }
  var i = Object.freeze({ __proto__: null, transformCallback: o2, invoke: r2, convertFileSrc: c });

  // node_modules/@tauri-apps/api/tauri-3d655ecc.js
  function o3(o14) {
    return o(this, void 0, void 0, function() {
      return a(this, function(i9) {
        return [2, r2("tauri", o14)];
      });
    });
  }

  // node_modules/@tauri-apps/api/event-86d4e8b3.js
  function e(r7, e6) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Event", message: { cmd: "unlisten", event: r7, eventId: e6 } })];
      });
    });
  }
  function u(r7, e6, u10) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        switch (t2.label) {
          case 0:
            return [4, o3({ __tauriModule: "Event", message: { cmd: "emit", event: r7, windowLabel: e6, payload: "string" == typeof u10 ? u10 : JSON.stringify(u10) } })];
          case 1:
            return t2.sent(), [2];
        }
      });
    });
  }
  function o4(u10, o14, a12) {
    return o(this, void 0, void 0, function() {
      var s13 = this;
      return a(this, function(c11) {
        return [2, o3({ __tauriModule: "Event", message: { cmd: "listen", event: u10, windowLabel: o14, handler: o2(a12) } }).then(function(i9) {
          return function() {
            return o(s13, void 0, void 0, function() {
              return a(this, function(t2) {
                return [2, e(u10, i9)];
              });
            });
          };
        })];
      });
    });
  }
  function a2(i9, r7, u10) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o4(i9, r7, function(t3) {
          u10(t3), e(i9, t3.id).catch(function() {
          });
        })];
      });
    });
  }
  var s;
  function c2(i9, r7) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o4(i9, null, r7)];
      });
    });
  }
  function d(i9, r7) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, a2(i9, null, r7)];
      });
    });
  }
  function f(i9, r7) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, u(i9, void 0, r7)];
      });
    });
  }
  !function(t2) {
    t2.WINDOW_RESIZED = "tauri://resize", t2.WINDOW_MOVED = "tauri://move", t2.WINDOW_CLOSE_REQUESTED = "tauri://close-requested", t2.WINDOW_CREATED = "tauri://window-created", t2.WINDOW_DESTROYED = "tauri://destroyed", t2.WINDOW_FOCUS = "tauri://focus", t2.WINDOW_BLUR = "tauri://blur", t2.WINDOW_SCALE_FACTOR_CHANGED = "tauri://scale-change", t2.WINDOW_THEME_CHANGED = "tauri://theme-changed", t2.WINDOW_FILE_DROP = "tauri://file-drop", t2.WINDOW_FILE_DROP_HOVER = "tauri://file-drop-hover", t2.WINDOW_FILE_DROP_CANCELLED = "tauri://file-drop-cancelled", t2.MENU = "tauri://menu", t2.CHECK_UPDATE = "tauri://update", t2.UPDATE_AVAILABLE = "tauri://update-available", t2.INSTALL_UPDATE = "tauri://update-install", t2.STATUS_UPDATE = "tauri://update-status", t2.DOWNLOAD_PROGRESS = "tauri://update-download-progress";
  }(s || (s = {}));
  var _ = Object.freeze({ __proto__: null, get TauriEvent() {
    return s;
  }, listen: c2, once: d, emit: f });

  // node_modules/@tauri-apps/api/fs-ff088717.js
  var i2;
  function o5(i9, o14) {
    return void 0 === o14 && (o14 = {}), o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Fs", message: { cmd: "readTextFile", path: i9, options: o14 } })];
      });
    });
  }
  function r3(i9, o14) {
    return void 0 === o14 && (o14 = {}), o(this, void 0, void 0, function() {
      var t2;
      return a(this, function(e6) {
        switch (e6.label) {
          case 0:
            return [4, o3({ __tauriModule: "Fs", message: { cmd: "readFile", path: i9, options: o14 } })];
          case 1:
            return t2 = e6.sent(), [2, Uint8Array.from(t2)];
        }
      });
    });
  }
  function s2(i9, o14, r7) {
    return o(this, void 0, void 0, function() {
      var t2, s13;
      return a(this, function(e6) {
        return "object" == typeof r7 && Object.freeze(r7), "object" == typeof i9 && Object.freeze(i9), t2 = { path: "", contents: "" }, s13 = r7, "string" == typeof i9 ? t2.path = i9 : (t2.path = i9.path, t2.contents = i9.contents), "string" == typeof o14 ? t2.contents = null != o14 ? o14 : "" : s13 = o14, [2, o3({ __tauriModule: "Fs", message: { cmd: "writeFile", path: t2.path, contents: Array.from(new TextEncoder().encode(t2.contents)), options: s13 } })];
      });
    });
  }
  function u2(i9, o14, r7) {
    return o(this, void 0, void 0, function() {
      var t2, s13;
      return a(this, function(e6) {
        return "object" == typeof r7 && Object.freeze(r7), "object" == typeof i9 && Object.freeze(i9), t2 = { path: "", contents: [] }, s13 = r7, "string" == typeof i9 ? t2.path = i9 : (t2.path = i9.path, t2.contents = i9.contents), o14 && "dir" in o14 ? s13 = o14 : "string" == typeof i9 && (t2.contents = null != o14 ? o14 : []), [2, o3({ __tauriModule: "Fs", message: { cmd: "writeFile", path: t2.path, contents: Array.from(t2.contents instanceof ArrayBuffer ? new Uint8Array(t2.contents) : t2.contents), options: s13 } })];
      });
    });
  }
  function a3(i9, o14) {
    return void 0 === o14 && (o14 = {}), o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Fs", message: { cmd: "readDir", path: i9, options: o14 } })];
      });
    });
  }
  function c3(i9, o14) {
    return void 0 === o14 && (o14 = {}), o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Fs", message: { cmd: "createDir", path: i9, options: o14 } })];
      });
    });
  }
  function d2(i9, o14) {
    return void 0 === o14 && (o14 = {}), o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Fs", message: { cmd: "removeDir", path: i9, options: o14 } })];
      });
    });
  }
  function f2(i9, o14, r7) {
    return void 0 === r7 && (r7 = {}), o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Fs", message: { cmd: "copyFile", source: i9, destination: o14, options: r7 } })];
      });
    });
  }
  function p(i9, o14) {
    return void 0 === o14 && (o14 = {}), o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Fs", message: { cmd: "removeFile", path: i9, options: o14 } })];
      });
    });
  }
  function h(i9, o14, r7) {
    return void 0 === r7 && (r7 = {}), o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Fs", message: { cmd: "renameFile", oldPath: i9, newPath: o14, options: r7 } })];
      });
    });
  }
  function l(i9, o14) {
    return void 0 === o14 && (o14 = {}), o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Fs", message: { cmd: "exists", path: i9, options: o14 } })];
      });
    });
  }
  !function(t2) {
    t2[t2.Audio = 1] = "Audio", t2[t2.Cache = 2] = "Cache", t2[t2.Config = 3] = "Config", t2[t2.Data = 4] = "Data", t2[t2.LocalData = 5] = "LocalData", t2[t2.Desktop = 6] = "Desktop", t2[t2.Document = 7] = "Document", t2[t2.Download = 8] = "Download", t2[t2.Executable = 9] = "Executable", t2[t2.Font = 10] = "Font", t2[t2.Home = 11] = "Home", t2[t2.Picture = 12] = "Picture", t2[t2.Public = 13] = "Public", t2[t2.Runtime = 14] = "Runtime", t2[t2.Template = 15] = "Template", t2[t2.Video = 16] = "Video", t2[t2.Resource = 17] = "Resource", t2[t2.App = 18] = "App", t2[t2.Log = 19] = "Log", t2[t2.Temp = 20] = "Temp";
  }(i2 || (i2 = {}));
  var m = Object.freeze({ __proto__: null, get BaseDirectory() {
    return i2;
  }, get Dir() {
    return i2;
  }, readTextFile: o5, readBinaryFile: r3, writeTextFile: s2, writeFile: s2, writeBinaryFile: u2, readDir: a3, createDir: c3, removeDir: d2, copyFile: f2, removeFile: p, renameFile: h, exists: l });

  // node_modules/@tauri-apps/api/http-58a1c419.js
  var i3;
  !function(t2) {
    t2[t2.JSON = 1] = "JSON", t2[t2.Text = 2] = "Text", t2[t2.Binary = 3] = "Binary";
  }(i3 || (i3 = {}));
  var o6 = function() {
    function t2(t3, e6) {
      this.type = t3, this.payload = e6;
    }
    return t2.form = function(e6) {
      var r7 = {};
      for (var n7 in e6) {
        var i9 = e6[n7], o14 = void 0;
        o14 = "string" == typeof i9 ? i9 : i9 instanceof Uint8Array || Array.isArray(i9) ? Array.from(i9) : "string" == typeof i9.file ? { file: i9.file, mime: i9.mime, fileName: i9.fileName } : { file: Array.from(i9.file), mime: i9.mime, fileName: i9.fileName }, r7[n7] = o14;
      }
      return new t2("Form", r7);
    }, t2.json = function(e6) {
      return new t2("Json", e6);
    }, t2.text = function(e6) {
      return new t2("Text", e6);
    }, t2.bytes = function(e6) {
      return new t2("Bytes", Array.from(e6 instanceof ArrayBuffer ? new Uint8Array(e6) : e6));
    }, t2;
  }();
  var s3 = function(t2) {
    this.url = t2.url, this.status = t2.status, this.ok = this.status >= 200 && this.status < 300, this.headers = t2.headers, this.rawHeaders = t2.rawHeaders, this.data = t2.data;
  };
  var u3 = function() {
    function o14(t2) {
      this.id = t2;
    }
    return o14.prototype.drop = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Http", message: { cmd: "dropClient", client: this.id } })];
        });
      });
    }, o14.prototype.request = function(r7) {
      return o(this, void 0, void 0, function() {
        var t2;
        return a(this, function(e6) {
          return (t2 = !r7.responseType || r7.responseType === i3.JSON) && (r7.responseType = i3.Text), [2, o3({ __tauriModule: "Http", message: { cmd: "httpRequest", client: this.id, options: r7 } }).then(function(e7) {
            var r8 = new s3(e7);
            if (t2) {
              try {
                r8.data = JSON.parse(r8.data);
              } catch (t3) {
                if (r8.ok && "" === r8.data)
                  r8.data = {};
                else if (r8.ok)
                  throw Error("Failed to parse response `".concat(r8.data, "` as JSON: ").concat(t3, ";\n              try setting the `responseType` option to `ResponseType.Text` or `ResponseType.Binary` if the API does not return a JSON response."));
              }
              return r8;
            }
            return r8;
          })];
        });
      });
    }, o14.prototype.get = function(n7, i9) {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, this.request(r({ method: "GET", url: n7 }, i9))];
        });
      });
    }, o14.prototype.post = function(n7, i9, o15) {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, this.request(r({ method: "POST", url: n7, body: i9 }, o15))];
        });
      });
    }, o14.prototype.put = function(n7, i9, o15) {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, this.request(r({ method: "PUT", url: n7, body: i9 }, o15))];
        });
      });
    }, o14.prototype.patch = function(n7, i9) {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, this.request(r({ method: "PATCH", url: n7 }, i9))];
        });
      });
    }, o14.prototype.delete = function(n7, i9) {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, this.request(r({ method: "DELETE", url: n7 }, i9))];
        });
      });
    }, o14;
  }();
  function a4(r7) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Http", message: { cmd: "createClient", options: r7 } }).then(function(t3) {
          return new u3(t3);
        })];
      });
    });
  }
  var f3 = null;
  function c4(n7, i9) {
    var o14;
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        switch (t2.label) {
          case 0:
            return null !== f3 ? [3, 2] : [4, a4()];
          case 1:
            f3 = t2.sent(), t2.label = 2;
          case 2:
            return [2, f3.request(r({ url: n7, method: null !== (o14 = null == i9 ? void 0 : i9.method) && void 0 !== o14 ? o14 : "GET" }, i9))];
        }
      });
    });
  }
  var d3 = Object.freeze({ __proto__: null, getClient: a4, fetch: c4, Body: o6, Client: u3, Response: s3, get ResponseType() {
    return i3;
  } });

  // node_modules/@tauri-apps/api/os-check-27fe6e2b.js
  function n2() {
    return navigator.appVersion.includes("Win");
  }

  // node_modules/@tauri-apps/api/path-5af4eed5.js
  function o7() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.App } })];
      });
    });
  }
  function u4() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Audio } })];
      });
    });
  }
  function a5() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Cache } })];
      });
    });
  }
  function s4() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Config } })];
      });
    });
  }
  function c5() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Data } })];
      });
    });
  }
  function d4() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Desktop } })];
      });
    });
  }
  function h2() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Document } })];
      });
    });
  }
  function f4() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Download } })];
      });
    });
  }
  function v() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Executable } })];
      });
    });
  }
  function m2() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Font } })];
      });
    });
  }
  function l2() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Home } })];
      });
    });
  }
  function _2() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.LocalData } })];
      });
    });
  }
  function P() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Picture } })];
      });
    });
  }
  function p2() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Public } })];
      });
    });
  }
  function g() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Resource } })];
      });
    });
  }
  function D(n7) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: n7, directory: i2.Resource } })];
      });
    });
  }
  function M() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Runtime } })];
      });
    });
  }
  function y() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Template } })];
      });
    });
  }
  function b() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Video } })];
      });
    });
  }
  function j() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: i2.Log } })];
      });
    });
  }
  var x = n2() ? "\\" : "/";
  var A = n2() ? ";" : ":";
  function k() {
    for (var i9 = [], n7 = 0; n7 < arguments.length; n7++)
      i9[n7] = arguments[n7];
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "resolve", paths: i9 } })];
      });
    });
  }
  function z(i9) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "normalize", path: i9 } })];
      });
    });
  }
  function R() {
    for (var i9 = [], n7 = 0; n7 < arguments.length; n7++)
      i9[n7] = arguments[n7];
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "join", paths: i9 } })];
      });
    });
  }
  function w(i9) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "dirname", path: i9 } })];
      });
    });
  }
  function B(i9) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "extname", path: i9 } })];
      });
    });
  }
  function C(i9, n7) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "basename", path: i9, ext: n7 } })];
      });
    });
  }
  function L(i9) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Path", message: { cmd: "isAbsolute", path: i9 } })];
      });
    });
  }
  var q = Object.freeze({ __proto__: null, appDir: o7, audioDir: u4, cacheDir: a5, configDir: s4, dataDir: c5, desktopDir: d4, documentDir: h2, downloadDir: f4, executableDir: v, fontDir: m2, homeDir: l2, localDataDir: _2, pictureDir: P, publicDir: p2, resourceDir: g, resolveResource: D, runtimeDir: M, templateDir: y, videoDir: b, logDir: j, get BaseDirectory() {
    return i2;
  }, sep: x, delimiter: A, resolve: k, normalize: z, join: R, dirname: w, extname: B, basename: C, isAbsolute: L });

  // node_modules/@tauri-apps/api/shell-e5849d56.js
  function o8(t2, o14, s13, u10) {
    return void 0 === s13 && (s13 = []), o(this, void 0, void 0, function() {
      return a(this, function(e6) {
        return "object" == typeof s13 && Object.freeze(s13), [2, o3({ __tauriModule: "Shell", message: { cmd: "execute", program: o14, args: s13, options: u10, onEventFn: o2(t2) } })];
      });
    });
  }
  var s5 = function() {
    function t2() {
      this.eventListeners = /* @__PURE__ */ Object.create(null);
    }
    return t2.prototype.addListener = function(t3, e6) {
      return this.on(t3, e6);
    }, t2.prototype.removeListener = function(t3, e6) {
      return this.off(t3, e6);
    }, t2.prototype.on = function(t3, e6) {
      return t3 in this.eventListeners ? this.eventListeners[t3].push(e6) : this.eventListeners[t3] = [e6], this;
    }, t2.prototype.once = function(t3, e6) {
      var n7 = this, r7 = function() {
        for (var i9 = [], o14 = 0; o14 < arguments.length; o14++)
          i9[o14] = arguments[o14];
        n7.removeListener(t3, r7), e6.apply(void 0, i9);
      };
      return this.addListener(t3, r7);
    }, t2.prototype.off = function(t3, e6) {
      return t3 in this.eventListeners && (this.eventListeners[t3] = this.eventListeners[t3].filter(function(t4) {
        return t4 !== e6;
      })), this;
    }, t2.prototype.removeAllListeners = function(t3) {
      return t3 ? delete this.eventListeners[t3] : this.eventListeners = /* @__PURE__ */ Object.create(null), this;
    }, t2.prototype.emit = function(t3) {
      for (var e6 = [], n7 = 1; n7 < arguments.length; n7++)
        e6[n7 - 1] = arguments[n7];
      if (t3 in this.eventListeners) {
        for (var r7 = this.eventListeners[t3], i9 = 0, o14 = r7; i9 < o14.length; i9++) {
          var s13 = o14[i9];
          s13.apply(void 0, e6);
        }
        return true;
      }
      return false;
    }, t2.prototype.listenerCount = function(t3) {
      return t3 in this.eventListeners ? this.eventListeners[t3].length : 0;
    }, t2.prototype.prependListener = function(t3, e6) {
      return t3 in this.eventListeners ? this.eventListeners[t3].unshift(e6) : this.eventListeners[t3] = [e6], this;
    }, t2.prototype.prependOnceListener = function(t3, e6) {
      var n7 = this, r7 = function() {
        for (var i9 = [], o14 = 0; o14 < arguments.length; o14++)
          i9[o14] = arguments[o14];
        n7.removeListener(t3, r7), e6.apply(void 0, i9);
      };
      return this.prependListener(t3, r7);
    }, t2;
  }();
  var u5 = function() {
    function t2(t3) {
      this.pid = t3;
    }
    return t2.prototype.write = function(t3) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, o3({ __tauriModule: "Shell", message: { cmd: "stdinWrite", pid: this.pid, buffer: "string" == typeof t3 ? t3 : Array.from(t3) } })];
        });
      });
    }, t2.prototype.kill = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t3) {
          return [2, o3({ __tauriModule: "Shell", message: { cmd: "killChild", pid: this.pid } })];
        });
      });
    }, t2;
  }();
  var a6 = function(r7) {
    function i9(t2, e6, n7) {
      void 0 === e6 && (e6 = []);
      var i10 = r7.call(this) || this;
      return i10.stdout = new s5(), i10.stderr = new s5(), i10.program = t2, i10.args = "string" == typeof e6 ? [e6] : e6, i10.options = null != n7 ? n7 : {}, i10;
    }
    return n(i9, r7), i9.sidecar = function(t2, e6, n7) {
      void 0 === e6 && (e6 = []);
      var r8 = new i9(t2, e6, n7);
      return r8.options.sidecar = true, r8;
    }, i9.prototype.spawn = function() {
      return o(this, void 0, void 0, function() {
        var t2 = this;
        return a(this, function(e6) {
          return [2, o8(function(e7) {
            switch (e7.event) {
              case "Error":
                t2.emit("error", e7.payload);
                break;
              case "Terminated":
                t2.emit("close", e7.payload);
                break;
              case "Stdout":
                t2.stdout.emit("data", e7.payload);
                break;
              case "Stderr":
                t2.stderr.emit("data", e7.payload);
            }
          }, this.program, this.args, this.options).then(function(t3) {
            return new u5(t3);
          })];
        });
      });
    }, i9.prototype.execute = function() {
      return o(this, void 0, void 0, function() {
        var t2 = this;
        return a(this, function(e6) {
          return [2, new Promise(function(e7, n7) {
            t2.on("error", n7);
            var r8 = [], i10 = [];
            t2.stdout.on("data", function(t3) {
              r8.push(t3);
            }), t2.stderr.on("data", function(t3) {
              i10.push(t3);
            }), t2.on("close", function(t3) {
              e7({ code: t3.code, signal: t3.signal, stdout: r8.join("\n"), stderr: i10.join("\n") });
            }), t2.spawn().catch(n7);
          })];
        });
      });
    }, i9;
  }(s5);
  function c6(t2, i9) {
    return o(this, void 0, void 0, function() {
      return a(this, function(e6) {
        return [2, o3({ __tauriModule: "Shell", message: { cmd: "open", path: t2, with: i9 } })];
      });
    });
  }
  var p3 = Object.freeze({ __proto__: null, Command: a6, Child: u5, EventEmitter: s5, open: c6 });

  // node_modules/@tauri-apps/api/window-25493f72.js
  var d5;
  var c7 = function(t2, e6) {
    this.type = "Logical", this.width = t2, this.height = e6;
  };
  var l3 = function() {
    function t2(t3, e6) {
      this.type = "Physical", this.width = t3, this.height = e6;
    }
    return t2.prototype.toLogical = function(t3) {
      return new c7(this.width / t3, this.height / t3);
    }, t2;
  }();
  var h3 = function(t2, e6) {
    this.type = "Logical", this.x = t2, this.y = e6;
  };
  var p4 = function() {
    function t2(t3, e6) {
      this.type = "Physical", this.x = t3, this.y = e6;
    }
    return t2.prototype.toLogical = function(t3) {
      return new h3(this.x / t3, this.y / t3);
    }, t2;
  }();
  function f5() {
    return new w2(window.__TAURI_METADATA__.__currentWindow.label, { skip: true });
  }
  function m3() {
    return window.__TAURI_METADATA__.__windows.map(function(t2) {
      return new w2(t2.label, { skip: true });
    });
  }
  !function(t2) {
    t2[t2.Critical = 1] = "Critical", t2[t2.Informational = 2] = "Informational";
  }(d5 || (d5 = {}));
  var y2;
  var v2 = ["tauri://created", "tauri://error"];
  var _3 = function() {
    function t2(t3) {
      this.label = t3, this.listeners = /* @__PURE__ */ Object.create(null);
    }
    return t2.prototype.listen = function(t3, n7) {
      return o(this, void 0, void 0, function() {
        var e6 = this;
        return a(this, function(i9) {
          return this._handleTauriEvent(t3, n7) ? [2, Promise.resolve(function() {
            var i10 = e6.listeners[t3];
            i10.splice(i10.indexOf(n7), 1);
          })] : [2, o4(t3, this.label, n7)];
        });
      });
    }, t2.prototype.once = function(t3, n7) {
      return o(this, void 0, void 0, function() {
        var e6 = this;
        return a(this, function(i9) {
          return this._handleTauriEvent(t3, n7) ? [2, Promise.resolve(function() {
            var i10 = e6.listeners[t3];
            i10.splice(i10.indexOf(n7), 1);
          })] : [2, a2(t3, this.label, n7)];
        });
      });
    }, t2.prototype.emit = function(t3, n7) {
      return o(this, void 0, void 0, function() {
        var e6, o14;
        return a(this, function(i9) {
          if (v2.includes(t3)) {
            for (e6 = 0, o14 = this.listeners[t3] || []; e6 < o14.length; e6++)
              (0, o14[e6])({ event: t3, id: -1, windowLabel: this.label, payload: n7 });
            return [2, Promise.resolve()];
          }
          return [2, u(t3, this.label, n7)];
        });
      });
    }, t2.prototype._handleTauriEvent = function(t3, e6) {
      return !!v2.includes(t3) && (t3 in this.listeners ? this.listeners[t3].push(e6) : this.listeners[t3] = [e6], true);
    }, t2;
  }();
  var g2 = function(r7) {
    function a12() {
      return null !== r7 && r7.apply(this, arguments) || this;
    }
    return n(a12, r7), a12.prototype.scaleFactor = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "scaleFactor" } } } })];
        });
      });
    }, a12.prototype.innerPosition = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "innerPosition" } } } }).then(function(t3) {
            var e6 = t3.x, i9 = t3.y;
            return new p4(e6, i9);
          })];
        });
      });
    }, a12.prototype.outerPosition = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "outerPosition" } } } }).then(function(t3) {
            var e6 = t3.x, i9 = t3.y;
            return new p4(e6, i9);
          })];
        });
      });
    }, a12.prototype.innerSize = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "innerSize" } } } }).then(function(t3) {
            var e6 = t3.width, i9 = t3.height;
            return new l3(e6, i9);
          })];
        });
      });
    }, a12.prototype.outerSize = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "outerSize" } } } }).then(function(t3) {
            var e6 = t3.width, i9 = t3.height;
            return new l3(e6, i9);
          })];
        });
      });
    }, a12.prototype.isFullscreen = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "isFullscreen" } } } })];
        });
      });
    }, a12.prototype.isMaximized = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "isMaximized" } } } })];
        });
      });
    }, a12.prototype.isDecorated = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "isDecorated" } } } })];
        });
      });
    }, a12.prototype.isResizable = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "isResizable" } } } })];
        });
      });
    }, a12.prototype.isVisible = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "isVisible" } } } })];
        });
      });
    }, a12.prototype.theme = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "theme" } } } })];
        });
      });
    }, a12.prototype.center = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "center" } } } })];
        });
      });
    }, a12.prototype.requestUserAttention = function(t2) {
      return o(this, void 0, void 0, function() {
        var e6;
        return a(this, function(i9) {
          return e6 = null, t2 && (e6 = t2 === d5.Critical ? { type: "Critical" } : { type: "Informational" }), [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "requestUserAttention", payload: e6 } } } })];
        });
      });
    }, a12.prototype.setResizable = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setResizable", payload: t2 } } } })];
        });
      });
    }, a12.prototype.setTitle = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setTitle", payload: t2 } } } })];
        });
      });
    }, a12.prototype.maximize = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "maximize" } } } })];
        });
      });
    }, a12.prototype.unmaximize = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "unmaximize" } } } })];
        });
      });
    }, a12.prototype.toggleMaximize = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "toggleMaximize" } } } })];
        });
      });
    }, a12.prototype.minimize = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "minimize" } } } })];
        });
      });
    }, a12.prototype.unminimize = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "unminimize" } } } })];
        });
      });
    }, a12.prototype.show = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "show" } } } })];
        });
      });
    }, a12.prototype.hide = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "hide" } } } })];
        });
      });
    }, a12.prototype.close = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "close" } } } })];
        });
      });
    }, a12.prototype.setDecorations = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setDecorations", payload: t2 } } } })];
        });
      });
    }, a12.prototype.setAlwaysOnTop = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setAlwaysOnTop", payload: t2 } } } })];
        });
      });
    }, a12.prototype.setSize = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          if (!t2 || "Logical" !== t2.type && "Physical" !== t2.type)
            throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setSize", payload: { type: t2.type, data: { width: t2.width, height: t2.height } } } } } })];
        });
      });
    }, a12.prototype.setMinSize = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          if (t2 && "Logical" !== t2.type && "Physical" !== t2.type)
            throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setMinSize", payload: t2 ? { type: t2.type, data: { width: t2.width, height: t2.height } } : null } } } })];
        });
      });
    }, a12.prototype.setMaxSize = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          if (t2 && "Logical" !== t2.type && "Physical" !== t2.type)
            throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setMaxSize", payload: t2 ? { type: t2.type, data: { width: t2.width, height: t2.height } } : null } } } })];
        });
      });
    }, a12.prototype.setPosition = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          if (!t2 || "Logical" !== t2.type && "Physical" !== t2.type)
            throw new Error("the `position` argument must be either a LogicalPosition or a PhysicalPosition instance");
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setPosition", payload: { type: t2.type, data: { x: t2.x, y: t2.y } } } } } })];
        });
      });
    }, a12.prototype.setFullscreen = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setFullscreen", payload: t2 } } } })];
        });
      });
    }, a12.prototype.setFocus = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setFocus" } } } })];
        });
      });
    }, a12.prototype.setIcon = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setIcon", payload: { icon: "string" == typeof t2 ? t2 : Array.from(t2) } } } } })];
        });
      });
    }, a12.prototype.setSkipTaskbar = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setSkipTaskbar", payload: t2 } } } })];
        });
      });
    }, a12.prototype.setCursorGrab = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setCursorGrab", payload: t2 } } } })];
        });
      });
    }, a12.prototype.setCursorVisible = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setCursorVisible", payload: t2 } } } })];
        });
      });
    }, a12.prototype.setCursorIcon = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setCursorIcon", payload: t2 } } } })];
        });
      });
    }, a12.prototype.setCursorPosition = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          if (!t2 || "Logical" !== t2.type && "Physical" !== t2.type)
            throw new Error("the `position` argument must be either a LogicalPosition or a PhysicalPosition instance");
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setCursorPosition", payload: { type: t2.type, data: { x: t2.x, y: t2.y } } } } } })];
        });
      });
    }, a12.prototype.startDragging = function() {
      return o(this, void 0, void 0, function() {
        return a(this, function(t2) {
          return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "startDragging" } } } })];
        });
      });
    }, a12.prototype.onResized = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, this.listen(s.WINDOW_RESIZED, t2)];
        });
      });
    }, a12.prototype.onMoved = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, this.listen(s.WINDOW_MOVED, t2)];
        });
      });
    }, a12.prototype.onCloseRequested = function(t2) {
      return o(this, void 0, void 0, function() {
        var e6 = this;
        return a(this, function(i9) {
          return [2, this.listen(s.WINDOW_CLOSE_REQUESTED, function(i10) {
            var n7 = new b2(i10);
            Promise.resolve(t2(n7)).then(function() {
              if (!n7.isPreventDefault())
                return e6.close();
            });
          })];
        });
      });
    }, a12.prototype.onFocusChanged = function(t2) {
      return o(this, void 0, void 0, function() {
        var e6, o14;
        return a(this, function(i9) {
          switch (i9.label) {
            case 0:
              return [4, this.listen(s.WINDOW_FOCUS, function(e7) {
                t2(r(r({}, e7), { payload: true }));
              })];
            case 1:
              return e6 = i9.sent(), [4, this.listen(s.WINDOW_BLUR, function(e7) {
                t2(r(r({}, e7), { payload: false }));
              })];
            case 2:
              return o14 = i9.sent(), [2, function() {
                e6(), o14();
              }];
          }
        });
      });
    }, a12.prototype.onScaleChanged = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, this.listen(s.WINDOW_SCALE_FACTOR_CHANGED, t2)];
        });
      });
    }, a12.prototype.onMenuClicked = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, this.listen(s.MENU, t2)];
        });
      });
    }, a12.prototype.onFileDropEvent = function(t2) {
      return o(this, void 0, void 0, function() {
        var e6, o14, r8;
        return a(this, function(i9) {
          switch (i9.label) {
            case 0:
              return [4, this.listen(s.WINDOW_FILE_DROP, function(e7) {
                t2(r(r({}, e7), { payload: { type: "drop", paths: e7.payload } }));
              })];
            case 1:
              return e6 = i9.sent(), [4, this.listen(s.WINDOW_FILE_DROP_HOVER, function(e7) {
                t2(r(r({}, e7), { payload: { type: "hover", paths: e7.payload } }));
              })];
            case 2:
              return o14 = i9.sent(), [4, this.listen(s.WINDOW_FILE_DROP_CANCELLED, function(e7) {
                t2(r(r({}, e7), { payload: { type: "cancel" } }));
              })];
            case 3:
              return r8 = i9.sent(), [2, function() {
                e6(), o14(), r8();
              }];
          }
        });
      });
    }, a12.prototype.onThemeChanged = function(t2) {
      return o(this, void 0, void 0, function() {
        return a(this, function(e6) {
          return [2, this.listen(s.WINDOW_THEME_CHANGED, t2)];
        });
      });
    }, a12;
  }(_3);
  var b2 = function() {
    function t2(t3) {
      this._preventDefault = false, this.event = t3.event, this.windowLabel = t3.windowLabel, this.id = t3.id;
    }
    return t2.prototype.preventDefault = function() {
      this._preventDefault = true;
    }, t2.prototype.isPreventDefault = function() {
      return this._preventDefault;
    }, t2;
  }();
  var w2 = function(r7) {
    function a12(t2, a13) {
      void 0 === a13 && (a13 = {});
      var u10 = r7.call(this, t2) || this;
      return (null == a13 ? void 0 : a13.skip) || o3({ __tauriModule: "Window", message: { cmd: "createWebview", data: { options: r({ label: t2 }, a13) } } }).then(function() {
        return o(u10, void 0, void 0, function() {
          return a(this, function(t3) {
            return [2, this.emit("tauri://created")];
          });
        });
      }).catch(function(t3) {
        return o(u10, void 0, void 0, function() {
          return a(this, function(e6) {
            return [2, this.emit("tauri://error", t3)];
          });
        });
      }), u10;
    }
    return n(a12, r7), a12.getByLabel = function(t2) {
      return m3().some(function(e6) {
        return e6.label === t2;
      }) ? new a12(t2, { skip: true }) : null;
    }, a12;
  }(g2);
  function W() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { cmd: { type: "currentMonitor" } } } })];
      });
    });
  }
  function M2() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { cmd: { type: "primaryMonitor" } } } })];
      });
    });
  }
  function z2() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Window", message: { cmd: "manage", data: { cmd: { type: "availableMonitors" } } } })];
      });
    });
  }
  "__TAURI_METADATA__" in window ? y2 = new w2(window.__TAURI_METADATA__.__currentWindow.label, { skip: true }) : (console.warn('Could not find "window.__TAURI_METADATA__". The "appWindow" value will reference the "main" window label.\nNote that this is not an issue if running this frontend on a browser instead of a Tauri window.'), y2 = new w2("main", { skip: true }));
  var P2 = Object.freeze({ __proto__: null, WebviewWindow: w2, WebviewWindowHandle: _3, WindowManager: g2, CloseRequestedEvent: b2, getCurrent: f5, getAll: m3, get appWindow() {
    return y2;
  }, LogicalSize: c7, PhysicalSize: l3, LogicalPosition: h3, PhysicalPosition: p4, get UserAttentionType() {
    return d5;
  }, currentMonitor: W, primaryMonitor: M2, availableMonitors: z2 });

  // node_modules/@tauri-apps/api/os-31a780fa.js
  var e2 = n2() ? "\r\n" : "\n";
  function o9() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Os", message: { cmd: "platform" } })];
      });
    });
  }
  function s6() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Os", message: { cmd: "version" } })];
      });
    });
  }
  function u6() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Os", message: { cmd: "osType" } })];
      });
    });
  }
  function a7() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Os", message: { cmd: "arch" } })];
      });
    });
  }
  function c8() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Os", message: { cmd: "tempdir" } })];
      });
    });
  }
  var d6 = Object.freeze({ __proto__: null, EOL: e2, platform: o9, version: s6, type: u6, arch: a7, tempdir: c8 });

  // node_modules/@tauri-apps/api/app-e71555b6.js
  function i4() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "App", message: { cmd: "getAppVersion" } })];
      });
    });
  }
  function n3() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "App", message: { cmd: "getAppName" } })];
      });
    });
  }
  function o10() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "App", message: { cmd: "getTauriVersion" } })];
      });
    });
  }
  var u7 = Object.freeze({ __proto__: null, getName: n3, getVersion: i4, getTauriVersion: o10 });

  // node_modules/@tauri-apps/api/cli-152ced64.js
  function i5() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Cli", message: { cmd: "cliMatches" } })];
      });
    });
  }
  var s7 = Object.freeze({ __proto__: null, getMatches: i5 });

  // node_modules/@tauri-apps/api/clipboard-4edc6511.js
  function i6(i9) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Clipboard", message: { cmd: "writeText", data: i9 } })];
      });
    });
  }
  function a8() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "Clipboard", message: { cmd: "readText", data: null } })];
      });
    });
  }
  var o11 = Object.freeze({ __proto__: null, writeText: i6, readText: a8 });

  // node_modules/@tauri-apps/api/dialog-5c2a33bf.js
  function e3(e6) {
    return void 0 === e6 && (e6 = {}), o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return "object" == typeof e6 && Object.freeze(e6), [2, o3({ __tauriModule: "Dialog", message: { cmd: "openDialog", options: e6 } })];
      });
    });
  }
  function n4(e6) {
    return void 0 === e6 && (e6 = {}), o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return "object" == typeof e6 && Object.freeze(e6), [2, o3({ __tauriModule: "Dialog", message: { cmd: "saveDialog", options: e6 } })];
      });
    });
  }
  function r4(e6, n7) {
    var r7;
    return o(this, void 0, void 0, function() {
      var t2;
      return a(this, function(i9) {
        return t2 = "string" == typeof n7 ? { title: n7 } : n7, [2, o3({ __tauriModule: "Dialog", message: { cmd: "messageDialog", message: e6.toString(), title: null === (r7 = null == t2 ? void 0 : t2.title) || void 0 === r7 ? void 0 : r7.toString(), type: null == t2 ? void 0 : t2.type } })];
      });
    });
  }
  function s8(e6, n7) {
    var r7;
    return o(this, void 0, void 0, function() {
      var t2;
      return a(this, function(i9) {
        return t2 = "string" == typeof n7 ? { title: n7 } : n7, [2, o3({ __tauriModule: "Dialog", message: { cmd: "askDialog", message: e6.toString(), title: null === (r7 = null == t2 ? void 0 : t2.title) || void 0 === r7 ? void 0 : r7.toString(), type: null == t2 ? void 0 : t2.type } })];
      });
    });
  }
  function u8(e6, n7) {
    var r7;
    return o(this, void 0, void 0, function() {
      var t2;
      return a(this, function(i9) {
        return t2 = "string" == typeof n7 ? { title: n7 } : n7, [2, o3({ __tauriModule: "Dialog", message: { cmd: "confirmDialog", message: e6.toString(), title: null === (r7 = null == t2 ? void 0 : t2.title) || void 0 === r7 ? void 0 : r7.toString(), type: null == t2 ? void 0 : t2.type } })];
      });
    });
  }
  var a9 = Object.freeze({ __proto__: null, open: e3, save: n4, message: r4, ask: s8, confirm: u8 });

  // node_modules/@tauri-apps/api/globalShortcut-4a985527.js
  function u9(u10, o14) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "GlobalShortcut", message: { cmd: "register", shortcut: u10, handler: o2(o14) } })];
      });
    });
  }
  function o12(u10, o14) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "GlobalShortcut", message: { cmd: "registerAll", shortcuts: u10, handler: o2(o14) } })];
      });
    });
  }
  function n5(i9) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "GlobalShortcut", message: { cmd: "isRegistered", shortcut: i9 } })];
      });
    });
  }
  function s9(i9) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "GlobalShortcut", message: { cmd: "unregister", shortcut: i9 } })];
      });
    });
  }
  function a10() {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, o3({ __tauriModule: "GlobalShortcut", message: { cmd: "unregisterAll" } })];
      });
    });
  }
  var c9 = Object.freeze({ __proto__: null, register: u9, registerAll: o12, isRegistered: n5, unregister: s9, unregisterAll: a10 });

  // node_modules/@tauri-apps/api/notification-94d5c62f.js
  function n6() {
    return o(this, void 0, void 0, function() {
      return a(this, function(i9) {
        return "default" !== window.Notification.permission ? [2, Promise.resolve("granted" === window.Notification.permission)] : [2, o3({ __tauriModule: "Notification", message: { cmd: "isNotificationPermissionGranted" } })];
      });
    });
  }
  function e4() {
    return o(this, void 0, void 0, function() {
      return a(this, function(i9) {
        return [2, window.Notification.requestPermission()];
      });
    });
  }
  function s10(i9) {
    "string" == typeof i9 ? new window.Notification(i9) : new window.Notification(i9.title, i9);
  }
  var r5 = Object.freeze({ __proto__: null, sendNotification: s10, requestPermission: e4, isPermissionGranted: n6 });

  // node_modules/@tauri-apps/api/process-a29f5989.js
  function i7(i9) {
    return void 0 === i9 && (i9 = 0), o(this, void 0, void 0, function() {
      return a(this, function(e6) {
        return [2, o3({ __tauriModule: "Process", message: { cmd: "exit", exitCode: i9 } })];
      });
    });
  }
  function o13() {
    return o(this, void 0, void 0, function() {
      return a(this, function(e6) {
        return [2, o3({ __tauriModule: "Process", message: { cmd: "relaunch" } })];
      });
    });
  }
  var s11 = Object.freeze({ __proto__: null, exit: i7, relaunch: o13 });

  // node_modules/@tauri-apps/api/updater-204de9e4.js
  function c10(i9) {
    return o(this, void 0, void 0, function() {
      return a(this, function(t2) {
        return [2, c2(s.STATUS_UPDATE, function(t3) {
          i9(null == t3 ? void 0 : t3.payload);
        })];
      });
    });
  }
  function e5() {
    return o(this, void 0, void 0, function() {
      function t2() {
        o14 && o14(), o14 = void 0;
      }
      var o14;
      return a(this, function(n7) {
        return [2, new Promise(function(n8, u10) {
          c10(function(o15) {
            return o15.error ? (t2(), u10(o15.error)) : "DONE" === o15.status ? (t2(), n8()) : void 0;
          }).then(function(t3) {
            o14 = t3;
          }).catch(function(n9) {
            throw t2(), n9;
          }), f(s.INSTALL_UPDATE).catch(function(n9) {
            throw t2(), n9;
          });
        })];
      });
    });
  }
  function a11() {
    return o(this, void 0, void 0, function() {
      function t2() {
        o14 && o14(), o14 = void 0;
      }
      var o14;
      return a(this, function(n7) {
        return [2, new Promise(function(n8, e6) {
          d(s.UPDATE_AVAILABLE, function(o15) {
            var r7;
            r7 = null == o15 ? void 0 : o15.payload, t2(), n8({ manifest: r7, shouldUpdate: true });
          }).catch(function(n9) {
            throw t2(), n9;
          }), c10(function(o15) {
            return o15.error ? (t2(), e6(o15.error)) : "UPTODATE" === o15.status ? (t2(), n8({ shouldUpdate: false })) : void 0;
          }).then(function(t3) {
            o14 = t3;
          }).catch(function(n9) {
            throw t2(), n9;
          }), f(s.CHECK_UPDATE).catch(function(n9) {
            throw t2(), n9;
          });
        })];
      });
    });
  }
  var s12 = Object.freeze({ __proto__: null, onUpdaterEvent: c10, installUpdate: e5, checkUpdate: a11 });

  // node_modules/@tauri-apps/api/index.js
  function r6(t2) {
    return r6 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t3) {
      return typeof t3;
    } : function(t3) {
      return t3 && "function" == typeof Symbol && t3.constructor === Symbol && t3 !== Symbol.prototype ? "symbol" : typeof t3;
    }, r6(t2);
  }
  !function(t2) {
    var e6 = function(t3) {
      var e7, o14 = Object.prototype, n7 = o14.hasOwnProperty, i9 = "function" == typeof Symbol ? Symbol : {}, a12 = i9.iterator || "@@iterator", c11 = i9.asyncIterator || "@@asyncIterator", u10 = i9.toStringTag || "@@toStringTag";
      function s13(t4, r7, e8) {
        return Object.defineProperty(t4, r7, { value: e8, enumerable: true, configurable: true, writable: true }), t4[r7];
      }
      try {
        s13({}, "");
      } catch (t4) {
        s13 = function(t5, r7, e8) {
          return t5[r7] = e8;
        };
      }
      function f6(t4, r7, e8, o15) {
        var n8 = r7 && r7.prototype instanceof v3 ? r7 : v3, i10 = Object.create(n8.prototype), a13 = new G(o15 || []);
        return i10._invoke = function(t5, r8, e9) {
          var o16 = l4;
          return function(n9, i11) {
            if (o16 === y3)
              throw new Error("Generator is already running");
            if (o16 === d7) {
              if ("throw" === n9)
                throw i11;
              return T();
            }
            for (e9.method = n9, e9.arg = i11; ; ) {
              var a14 = e9.delegate;
              if (a14) {
                var c12 = S(a14, e9);
                if (c12) {
                  if (c12 === m4)
                    continue;
                  return c12;
                }
              }
              if ("next" === e9.method)
                e9.sent = e9._sent = e9.arg;
              else if ("throw" === e9.method) {
                if (o16 === l4)
                  throw o16 = d7, e9.arg;
                e9.dispatchException(e9.arg);
              } else
                "return" === e9.method && e9.abrupt("return", e9.arg);
              o16 = y3;
              var u11 = h4(t5, r8, e9);
              if ("normal" === u11.type) {
                if (o16 = e9.done ? d7 : p5, u11.arg === m4)
                  continue;
                return { value: u11.arg, done: e9.done };
              }
              "throw" === u11.type && (o16 = d7, e9.method = "throw", e9.arg = u11.arg);
            }
          };
        }(t4, e8, a13), i10;
      }
      function h4(t4, r7, e8) {
        try {
          return { type: "normal", arg: t4.call(r7, e8) };
        } catch (t5) {
          return { type: "throw", arg: t5 };
        }
      }
      t3.wrap = f6;
      var l4 = "suspendedStart", p5 = "suspendedYield", y3 = "executing", d7 = "completed", m4 = {};
      function v3() {
      }
      function g3() {
      }
      function w3() {
      }
      var b3 = {};
      s13(b3, a12, function() {
        return this;
      });
      var x2 = Object.getPrototypeOf, j2 = x2 && x2(x2(N([])));
      j2 && j2 !== o14 && n7.call(j2, a12) && (b3 = j2);
      var L2 = w3.prototype = v3.prototype = Object.create(b3);
      function E(t4) {
        ["next", "throw", "return"].forEach(function(r7) {
          s13(t4, r7, function(t5) {
            return this._invoke(r7, t5);
          });
        });
      }
      function _4(t4, e8) {
        function o15(i11, a13, c12, u11) {
          var s14 = h4(t4[i11], t4, a13);
          if ("throw" !== s14.type) {
            var f7 = s14.arg, l5 = f7.value;
            return l5 && "object" === r6(l5) && n7.call(l5, "__await") ? e8.resolve(l5.__await).then(function(t5) {
              o15("next", t5, c12, u11);
            }, function(t5) {
              o15("throw", t5, c12, u11);
            }) : e8.resolve(l5).then(function(t5) {
              f7.value = t5, c12(f7);
            }, function(t5) {
              return o15("throw", t5, c12, u11);
            });
          }
          u11(s14.arg);
        }
        var i10;
        this._invoke = function(t5, r7) {
          function n8() {
            return new e8(function(e9, n9) {
              o15(t5, r7, e9, n9);
            });
          }
          return i10 = i10 ? i10.then(n8, n8) : n8();
        };
      }
      function S(t4, r7) {
        var o15 = t4.iterator[r7.method];
        if (o15 === e7) {
          if (r7.delegate = null, "throw" === r7.method) {
            if (t4.iterator.return && (r7.method = "return", r7.arg = e7, S(t4, r7), "throw" === r7.method))
              return m4;
            r7.method = "throw", r7.arg = new TypeError("The iterator does not provide a 'throw' method");
          }
          return m4;
        }
        var n8 = h4(o15, t4.iterator, r7.arg);
        if ("throw" === n8.type)
          return r7.method = "throw", r7.arg = n8.arg, r7.delegate = null, m4;
        var i10 = n8.arg;
        return i10 ? i10.done ? (r7[t4.resultName] = i10.value, r7.next = t4.nextLoc, "return" !== r7.method && (r7.method = "next", r7.arg = e7), r7.delegate = null, m4) : i10 : (r7.method = "throw", r7.arg = new TypeError("iterator result is not an object"), r7.delegate = null, m4);
      }
      function O(t4) {
        var r7 = { tryLoc: t4[0] };
        1 in t4 && (r7.catchLoc = t4[1]), 2 in t4 && (r7.finallyLoc = t4[2], r7.afterLoc = t4[3]), this.tryEntries.push(r7);
      }
      function k2(t4) {
        var r7 = t4.completion || {};
        r7.type = "normal", delete r7.arg, t4.completion = r7;
      }
      function G(t4) {
        this.tryEntries = [{ tryLoc: "root" }], t4.forEach(O, this), this.reset(true);
      }
      function N(t4) {
        if (t4) {
          var r7 = t4[a12];
          if (r7)
            return r7.call(t4);
          if ("function" == typeof t4.next)
            return t4;
          if (!isNaN(t4.length)) {
            var o15 = -1, i10 = function r8() {
              for (; ++o15 < t4.length; )
                if (n7.call(t4, o15))
                  return r8.value = t4[o15], r8.done = false, r8;
              return r8.value = e7, r8.done = true, r8;
            };
            return i10.next = i10;
          }
        }
        return { next: T };
      }
      function T() {
        return { value: e7, done: true };
      }
      return g3.prototype = w3, s13(L2, "constructor", w3), s13(w3, "constructor", g3), g3.displayName = s13(w3, u10, "GeneratorFunction"), t3.isGeneratorFunction = function(t4) {
        var r7 = "function" == typeof t4 && t4.constructor;
        return !!r7 && (r7 === g3 || "GeneratorFunction" === (r7.displayName || r7.name));
      }, t3.mark = function(t4) {
        return Object.setPrototypeOf ? Object.setPrototypeOf(t4, w3) : (t4.__proto__ = w3, s13(t4, u10, "GeneratorFunction")), t4.prototype = Object.create(L2), t4;
      }, t3.awrap = function(t4) {
        return { __await: t4 };
      }, E(_4.prototype), s13(_4.prototype, c11, function() {
        return this;
      }), t3.AsyncIterator = _4, t3.async = function(r7, e8, o15, n8, i10) {
        void 0 === i10 && (i10 = Promise);
        var a13 = new _4(f6(r7, e8, o15, n8), i10);
        return t3.isGeneratorFunction(e8) ? a13 : a13.next().then(function(t4) {
          return t4.done ? t4.value : a13.next();
        });
      }, E(L2), s13(L2, u10, "Generator"), s13(L2, a12, function() {
        return this;
      }), s13(L2, "toString", function() {
        return "[object Generator]";
      }), t3.keys = function(t4) {
        var r7 = [];
        for (var e8 in t4)
          r7.push(e8);
        return r7.reverse(), function e9() {
          for (; r7.length; ) {
            var o15 = r7.pop();
            if (o15 in t4)
              return e9.value = o15, e9.done = false, e9;
          }
          return e9.done = true, e9;
        };
      }, t3.values = N, G.prototype = { constructor: G, reset: function(t4) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = e7, this.done = false, this.delegate = null, this.method = "next", this.arg = e7, this.tryEntries.forEach(k2), !t4)
          for (var r7 in this)
            "t" === r7.charAt(0) && n7.call(this, r7) && !isNaN(+r7.slice(1)) && (this[r7] = e7);
      }, stop: function() {
        this.done = true;
        var t4 = this.tryEntries[0].completion;
        if ("throw" === t4.type)
          throw t4.arg;
        return this.rval;
      }, dispatchException: function(t4) {
        if (this.done)
          throw t4;
        var r7 = this;
        function o15(o16, n8) {
          return c12.type = "throw", c12.arg = t4, r7.next = o16, n8 && (r7.method = "next", r7.arg = e7), !!n8;
        }
        for (var i10 = this.tryEntries.length - 1; i10 >= 0; --i10) {
          var a13 = this.tryEntries[i10], c12 = a13.completion;
          if ("root" === a13.tryLoc)
            return o15("end");
          if (a13.tryLoc <= this.prev) {
            var u11 = n7.call(a13, "catchLoc"), s14 = n7.call(a13, "finallyLoc");
            if (u11 && s14) {
              if (this.prev < a13.catchLoc)
                return o15(a13.catchLoc, true);
              if (this.prev < a13.finallyLoc)
                return o15(a13.finallyLoc);
            } else if (u11) {
              if (this.prev < a13.catchLoc)
                return o15(a13.catchLoc, true);
            } else {
              if (!s14)
                throw new Error("try statement without catch or finally");
              if (this.prev < a13.finallyLoc)
                return o15(a13.finallyLoc);
            }
          }
        }
      }, abrupt: function(t4, r7) {
        for (var e8 = this.tryEntries.length - 1; e8 >= 0; --e8) {
          var o15 = this.tryEntries[e8];
          if (o15.tryLoc <= this.prev && n7.call(o15, "finallyLoc") && this.prev < o15.finallyLoc) {
            var i10 = o15;
            break;
          }
        }
        i10 && ("break" === t4 || "continue" === t4) && i10.tryLoc <= r7 && r7 <= i10.finallyLoc && (i10 = null);
        var a13 = i10 ? i10.completion : {};
        return a13.type = t4, a13.arg = r7, i10 ? (this.method = "next", this.next = i10.finallyLoc, m4) : this.complete(a13);
      }, complete: function(t4, r7) {
        if ("throw" === t4.type)
          throw t4.arg;
        return "break" === t4.type || "continue" === t4.type ? this.next = t4.arg : "return" === t4.type ? (this.rval = this.arg = t4.arg, this.method = "return", this.next = "end") : "normal" === t4.type && r7 && (this.next = r7), m4;
      }, finish: function(t4) {
        for (var r7 = this.tryEntries.length - 1; r7 >= 0; --r7) {
          var e8 = this.tryEntries[r7];
          if (e8.finallyLoc === t4)
            return this.complete(e8.completion, e8.afterLoc), k2(e8), m4;
        }
      }, catch: function(t4) {
        for (var r7 = this.tryEntries.length - 1; r7 >= 0; --r7) {
          var e8 = this.tryEntries[r7];
          if (e8.tryLoc === t4) {
            var o15 = e8.completion;
            if ("throw" === o15.type) {
              var n8 = o15.arg;
              k2(e8);
            }
            return n8;
          }
        }
        throw new Error("illegal catch attempt");
      }, delegateYield: function(t4, r7, o15) {
        return this.delegate = { iterator: N(t4), resultName: r7, nextLoc: o15 }, "next" === this.method && (this.arg = e7), m4;
      } }, t3;
    }(t2.exports);
    try {
      regeneratorRuntime = e6;
    } catch (t3) {
      "object" === ("undefined" == typeof globalThis ? "undefined" : r6(globalThis)) ? globalThis.regeneratorRuntime = e6 : Function("r", "regeneratorRuntime = r")(e6);
    }
  }({ exports: {} });
  var i8 = r2;

  // src-ui/src/main.ts
  function addMessage(div, message) {
    let v3 = div.value;
    div.value = message;
  }
  var backendDiv = document.getElementById("backend");
  c2("message", (event) => {
    addMessage(backendDiv, event.payload);
  });
  var frontendDiv = document.getElementById("frontend");
  var command = a6.sidecar("binaries/appx");
  command.on("close", (data) => {
    addMessage(
      frontendDiv,
      `command finished with code ${data.code} and signal ${data.signal}`
    );
  });
  command.on(
    "error",
    (error) => addMessage(frontendDiv, `command error: "${error}"`)
  );
  command.stdout.on(
    "data",
    (line) => addMessage(frontendDiv, `command stdout: "${line}"`)
  );
  command.stderr.on(
    "data",
    (line) => addMessage(frontendDiv, `command stderr: "${line}"`)
  );
  command.spawn();
  var $ = document.querySelector.bind(document);
  document.addEventListener("DOMContentLoaded", async function() {
    const helloEl = $("div.hello");
    const counterButtonEl = $("counter-button");
    const counterResultEl = $("counter-result");
    const pingEl = $("backend-ping");
    c2("backend-ping", function(evt) {
      pingEl.classList.add("on");
      setTimeout(function() {
        pingEl.classList.remove("on");
      }, 500);
    });
    counterButtonEl.addEventListener("click", async function() {
      const result = await i8("add_count", { num: 3 });
      console.log(result);
      counterResultEl.textContent = result;
    });
    helloEl.addEventListener("click", async function() {
      const result = await i8("hello_world");
      helloEl.textContent = result;
      const webview = new w2("linked_learning", {
        url: "https://www.linkedin.com/learning-login"
      });
      webview.once("tauri://created", function() {
      });
      webview.once("tauri://error", function(e6) {
      });
      await webview.emit("some event", "data");
      const unlisten = await webview.listen("event name", (e6) => {
      });
      unlisten();
      setTimeout(function() {
        helloEl.textContent = "Click again";
      }, 1e3);
    });
  });
})();
//# sourceMappingURL=main.js.map
