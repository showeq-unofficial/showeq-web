/****************************************************************************
** Meta object code from reading C++ file 'bazaarlog.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/bazaarlog.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'bazaarlog.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_BazaarLog_t {
    QByteArrayData data[6];
    char stringdata0[54];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_BazaarLog_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_BazaarLog_t qt_meta_stringdata_BazaarLog = {
    {
QT_MOC_LITERAL(0, 0, 9), // "BazaarLog"
QT_MOC_LITERAL(1, 10, 12), // "bazaarSearch"
QT_MOC_LITERAL(2, 23, 0), // ""
QT_MOC_LITERAL(3, 24, 14), // "const uint8_t*"
QT_MOC_LITERAL(4, 39, 6), // "size_t"
QT_MOC_LITERAL(5, 46, 7) // "uint8_t"

    },
    "BazaarLog\0bazaarSearch\0\0const uint8_t*\0"
    "size_t\0uint8_t"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_BazaarLog[] = {

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
       1,    3,   19,    2, 0x0a /* Public */,

 // slots: parameters
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 4, 0x80000000 | 5,    2,    2,    2,

       0        // eod
};

void BazaarLog::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<BazaarLog *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->bazaarSearch((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        default: ;
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject BazaarLog::staticMetaObject = { {
    QMetaObject::SuperData::link<SEQLogger::staticMetaObject>(),
    qt_meta_stringdata_BazaarLog.data,
    qt_meta_data_BazaarLog,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *BazaarLog::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *BazaarLog::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_BazaarLog.stringdata0))
        return static_cast<void*>(this);
    return SEQLogger::qt_metacast(_clname);
}

int BazaarLog::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = SEQLogger::qt_metacall(_c, _id, _a);
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
QT_WARNING_POP
QT_END_MOC_NAMESPACE
