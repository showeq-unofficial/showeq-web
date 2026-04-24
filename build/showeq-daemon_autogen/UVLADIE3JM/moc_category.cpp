/****************************************************************************
** Meta object code from reading C++ file 'category.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/category.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'category.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_CategoryDlg_t {
    QByteArrayData data[3];
    char stringdata0[26];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_CategoryDlg_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_CategoryDlg_t qt_meta_stringdata_CategoryDlg = {
    {
QT_MOC_LITERAL(0, 0, 11), // "CategoryDlg"
QT_MOC_LITERAL(1, 12, 12), // "select_color"
QT_MOC_LITERAL(2, 25, 0) // ""

    },
    "CategoryDlg\0select_color\0"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_CategoryDlg[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
       1,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // slots: name, argc, parameters, tag, flags
       1,    0,   19,    2, 0x0a /* Public */,

 // slots: parameters
    QMetaType::Void,

       0        // eod
};

void CategoryDlg::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<CategoryDlg *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->select_color(); break;
        default: ;
        }
    }
    (void)_a;
}

QT_INIT_METAOBJECT const QMetaObject CategoryDlg::staticMetaObject = { {
    QMetaObject::SuperData::link<QDialog::staticMetaObject>(),
    qt_meta_stringdata_CategoryDlg.data,
    qt_meta_data_CategoryDlg,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *CategoryDlg::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *CategoryDlg::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_CategoryDlg.stringdata0))
        return static_cast<void*>(this);
    return QDialog::qt_metacast(_clname);
}

int CategoryDlg::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QDialog::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 1)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 1;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 1)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 1;
    }
    return _id;
}
struct qt_meta_stringdata_CategoryMgr_t {
    QByteArrayData data[14];
    char stringdata0[166];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_CategoryMgr_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_CategoryMgr_t qt_meta_stringdata_CategoryMgr = {
    {
QT_MOC_LITERAL(0, 0, 11), // "CategoryMgr"
QT_MOC_LITERAL(1, 12, 11), // "addCategory"
QT_MOC_LITERAL(2, 24, 0), // ""
QT_MOC_LITERAL(3, 25, 15), // "const Category*"
QT_MOC_LITERAL(4, 41, 3), // "cat"
QT_MOC_LITERAL(5, 45, 11), // "delCategory"
QT_MOC_LITERAL(6, 57, 17), // "clearedCategories"
QT_MOC_LITERAL(7, 75, 16), // "loadedCategories"
QT_MOC_LITERAL(8, 92, 15), // "clearCategories"
QT_MOC_LITERAL(9, 108, 8), // "QWidget*"
QT_MOC_LITERAL(10, 117, 6), // "parent"
QT_MOC_LITERAL(11, 124, 14), // "editCategories"
QT_MOC_LITERAL(12, 139, 16), // "reloadCategories"
QT_MOC_LITERAL(13, 156, 9) // "savePrefs"

    },
    "CategoryMgr\0addCategory\0\0const Category*\0"
    "cat\0delCategory\0clearedCategories\0"
    "loadedCategories\0clearCategories\0"
    "QWidget*\0parent\0editCategories\0"
    "reloadCategories\0savePrefs"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_CategoryMgr[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
      11,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       4,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    1,   69,    2, 0x06 /* Public */,
       5,    1,   72,    2, 0x06 /* Public */,
       6,    0,   75,    2, 0x06 /* Public */,
       7,    0,   76,    2, 0x06 /* Public */,

 // slots: name, argc, parameters, tag, flags
       8,    0,   77,    2, 0x0a /* Public */,
       1,    1,   78,    2, 0x0a /* Public */,
       1,    0,   81,    2, 0x2a /* Public | MethodCloned */,
      11,    2,   82,    2, 0x0a /* Public */,
      11,    1,   87,    2, 0x2a /* Public | MethodCloned */,
      12,    0,   90,    2, 0x0a /* Public */,
      13,    0,   91,    2, 0x0a /* Public */,

 // signals: parameters
    QMetaType::Void, 0x80000000 | 3,    4,
    QMetaType::Void, 0x80000000 | 3,    4,
    QMetaType::Void,
    QMetaType::Void,

 // slots: parameters
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 9,   10,
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 9,    4,   10,
    QMetaType::Void, 0x80000000 | 3,    4,
    QMetaType::Void,
    QMetaType::Void,

       0        // eod
};

void CategoryMgr::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<CategoryMgr *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->addCategory((*reinterpret_cast< const Category*(*)>(_a[1]))); break;
        case 1: _t->delCategory((*reinterpret_cast< const Category*(*)>(_a[1]))); break;
        case 2: _t->clearedCategories(); break;
        case 3: _t->loadedCategories(); break;
        case 4: _t->clearCategories(); break;
        case 5: _t->addCategory((*reinterpret_cast< QWidget*(*)>(_a[1]))); break;
        case 6: _t->addCategory(); break;
        case 7: _t->editCategories((*reinterpret_cast< const Category*(*)>(_a[1])),(*reinterpret_cast< QWidget*(*)>(_a[2]))); break;
        case 8: _t->editCategories((*reinterpret_cast< const Category*(*)>(_a[1]))); break;
        case 9: _t->reloadCategories(); break;
        case 10: _t->savePrefs(); break;
        default: ;
        }
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        switch (_id) {
        default: *reinterpret_cast<int*>(_a[0]) = -1; break;
        case 5:
            switch (*reinterpret_cast<int*>(_a[1])) {
            default: *reinterpret_cast<int*>(_a[0]) = -1; break;
            case 0:
                *reinterpret_cast<int*>(_a[0]) = qRegisterMetaType< QWidget* >(); break;
            }
            break;
        case 7:
            switch (*reinterpret_cast<int*>(_a[1])) {
            default: *reinterpret_cast<int*>(_a[0]) = -1; break;
            case 1:
                *reinterpret_cast<int*>(_a[0]) = qRegisterMetaType< QWidget* >(); break;
            }
            break;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (CategoryMgr::*)(const Category * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&CategoryMgr::addCategory)) {
                *result = 0;
                return;
            }
        }
        {
            using _t = void (CategoryMgr::*)(const Category * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&CategoryMgr::delCategory)) {
                *result = 1;
                return;
            }
        }
        {
            using _t = void (CategoryMgr::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&CategoryMgr::clearedCategories)) {
                *result = 2;
                return;
            }
        }
        {
            using _t = void (CategoryMgr::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&CategoryMgr::loadedCategories)) {
                *result = 3;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject CategoryMgr::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_CategoryMgr.data,
    qt_meta_data_CategoryMgr,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *CategoryMgr::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *CategoryMgr::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_CategoryMgr.stringdata0))
        return static_cast<void*>(this);
    return QObject::qt_metacast(_clname);
}

int CategoryMgr::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 11)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 11;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 11)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 11;
    }
    return _id;
}

// SIGNAL 0
void CategoryMgr::addCategory(const Category * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}

// SIGNAL 1
void CategoryMgr::delCategory(const Category * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 1, _a);
}

// SIGNAL 2
void CategoryMgr::clearedCategories()
{
    QMetaObject::activate(this, &staticMetaObject, 2, nullptr);
}

// SIGNAL 3
void CategoryMgr::loadedCategories()
{
    QMetaObject::activate(this, &staticMetaObject, 3, nullptr);
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
