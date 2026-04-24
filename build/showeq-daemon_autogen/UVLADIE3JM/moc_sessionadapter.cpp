/****************************************************************************
** Meta object code from reading C++ file 'sessionadapter.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/sessionadapter.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'sessionadapter.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_SessionAdapter_t {
    QByteArrayData data[21];
    char stringdata0[209];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_SessionAdapter_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_SessionAdapter_t qt_meta_stringdata_SessionAdapter = {
    {
QT_MOC_LITERAL(0, 0, 14), // "SessionAdapter"
QT_MOC_LITERAL(1, 15, 13), // "onTextMessage"
QT_MOC_LITERAL(2, 29, 0), // ""
QT_MOC_LITERAL(3, 30, 4), // "text"
QT_MOC_LITERAL(4, 35, 15), // "onBinaryMessage"
QT_MOC_LITERAL(5, 51, 5), // "bytes"
QT_MOC_LITERAL(6, 57, 9), // "onAddItem"
QT_MOC_LITERAL(7, 67, 11), // "const Item*"
QT_MOC_LITERAL(8, 79, 4), // "item"
QT_MOC_LITERAL(9, 84, 9), // "onDelItem"
QT_MOC_LITERAL(10, 94, 12), // "onChangeItem"
QT_MOC_LITERAL(11, 107, 8), // "uint32_t"
QT_MOC_LITERAL(12, 116, 10), // "changeType"
QT_MOC_LITERAL(13, 127, 11), // "onKillSpawn"
QT_MOC_LITERAL(14, 139, 8), // "deceased"
QT_MOC_LITERAL(15, 148, 6), // "killer"
QT_MOC_LITERAL(16, 155, 8), // "uint16_t"
QT_MOC_LITERAL(17, 164, 8), // "killerId"
QT_MOC_LITERAL(18, 173, 11), // "onZoneBegin"
QT_MOC_LITERAL(19, 185, 9), // "shortName"
QT_MOC_LITERAL(20, 195, 13) // "onZoneChanged"

    },
    "SessionAdapter\0onTextMessage\0\0text\0"
    "onBinaryMessage\0bytes\0onAddItem\0"
    "const Item*\0item\0onDelItem\0onChangeItem\0"
    "uint32_t\0changeType\0onKillSpawn\0"
    "deceased\0killer\0uint16_t\0killerId\0"
    "onZoneBegin\0shortName\0onZoneChanged"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_SessionAdapter[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
       8,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // slots: name, argc, parameters, tag, flags
       1,    1,   54,    2, 0x08 /* Private */,
       4,    1,   57,    2, 0x08 /* Private */,
       6,    1,   60,    2, 0x08 /* Private */,
       9,    1,   63,    2, 0x08 /* Private */,
      10,    2,   66,    2, 0x08 /* Private */,
      13,    3,   71,    2, 0x08 /* Private */,
      18,    1,   78,    2, 0x08 /* Private */,
      20,    1,   81,    2, 0x08 /* Private */,

 // slots: parameters
    QMetaType::Void, QMetaType::QString,    3,
    QMetaType::Void, QMetaType::QByteArray,    5,
    QMetaType::Void, 0x80000000 | 7,    8,
    QMetaType::Void, 0x80000000 | 7,    8,
    QMetaType::Void, 0x80000000 | 7, 0x80000000 | 11,    8,   12,
    QMetaType::Void, 0x80000000 | 7, 0x80000000 | 7, 0x80000000 | 16,   14,   15,   17,
    QMetaType::Void, QMetaType::QString,   19,
    QMetaType::Void, QMetaType::QString,   19,

       0        // eod
};

void SessionAdapter::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<SessionAdapter *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->onTextMessage((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 1: _t->onBinaryMessage((*reinterpret_cast< const QByteArray(*)>(_a[1]))); break;
        case 2: _t->onAddItem((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 3: _t->onDelItem((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 4: _t->onChangeItem((*reinterpret_cast< const Item*(*)>(_a[1])),(*reinterpret_cast< uint32_t(*)>(_a[2]))); break;
        case 5: _t->onKillSpawn((*reinterpret_cast< const Item*(*)>(_a[1])),(*reinterpret_cast< const Item*(*)>(_a[2])),(*reinterpret_cast< uint16_t(*)>(_a[3]))); break;
        case 6: _t->onZoneBegin((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 7: _t->onZoneChanged((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        default: ;
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject SessionAdapter::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_SessionAdapter.data,
    qt_meta_data_SessionAdapter,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *SessionAdapter::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *SessionAdapter::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_SessionAdapter.stringdata0))
        return static_cast<void*>(this);
    return QObject::qt_metacast(_clname);
}

int SessionAdapter::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 8)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 8;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 8)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 8;
    }
    return _id;
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
