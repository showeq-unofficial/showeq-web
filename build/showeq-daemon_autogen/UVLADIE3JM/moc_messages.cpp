/****************************************************************************
** Meta object code from reading C++ file 'messages.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/messages.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'messages.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_Messages_t {
    QByteArrayData data[20];
    char stringdata0[173];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_Messages_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_Messages_t qt_meta_stringdata_Messages = {
    {
QT_MOC_LITERAL(0, 0, 8), // "Messages"
QT_MOC_LITERAL(1, 9, 10), // "newMessage"
QT_MOC_LITERAL(2, 20, 0), // ""
QT_MOC_LITERAL(3, 21, 12), // "MessageEntry"
QT_MOC_LITERAL(4, 34, 7), // "message"
QT_MOC_LITERAL(5, 42, 7), // "cleared"
QT_MOC_LITERAL(6, 50, 10), // "addMessage"
QT_MOC_LITERAL(7, 61, 11), // "MessageType"
QT_MOC_LITERAL(8, 73, 4), // "type"
QT_MOC_LITERAL(9, 78, 4), // "text"
QT_MOC_LITERAL(10, 83, 8), // "uint32_t"
QT_MOC_LITERAL(11, 92, 5), // "color"
QT_MOC_LITERAL(12, 98, 5), // "clear"
QT_MOC_LITERAL(13, 104, 13), // "removedFilter"
QT_MOC_LITERAL(14, 118, 4), // "mask"
QT_MOC_LITERAL(15, 123, 7), // "uint8_t"
QT_MOC_LITERAL(16, 131, 6), // "filter"
QT_MOC_LITERAL(17, 138, 11), // "addedFilter"
QT_MOC_LITERAL(18, 150, 8), // "filterid"
QT_MOC_LITERAL(19, 159, 13) // "MessageFilter"

    },
    "Messages\0newMessage\0\0MessageEntry\0"
    "message\0cleared\0addMessage\0MessageType\0"
    "type\0text\0uint32_t\0color\0clear\0"
    "removedFilter\0mask\0uint8_t\0filter\0"
    "addedFilter\0filterid\0MessageFilter"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_Messages[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
       7,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       2,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    1,   49,    2, 0x06 /* Public */,
       5,    0,   52,    2, 0x06 /* Public */,

 // slots: name, argc, parameters, tag, flags
       6,    3,   53,    2, 0x0a /* Public */,
       6,    2,   60,    2, 0x2a /* Public | MethodCloned */,
      12,    0,   65,    2, 0x0a /* Public */,
      13,    2,   66,    2, 0x09 /* Protected */,
      17,    3,   71,    2, 0x09 /* Protected */,

 // signals: parameters
    QMetaType::Void, 0x80000000 | 3,    4,
    QMetaType::Void,

 // slots: parameters
    QMetaType::Void, 0x80000000 | 7, QMetaType::QString, 0x80000000 | 10,    8,    9,   11,
    QMetaType::Void, 0x80000000 | 7, QMetaType::QString,    8,    9,
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 10, 0x80000000 | 15,   14,   16,
    QMetaType::Void, 0x80000000 | 10, 0x80000000 | 15, 0x80000000 | 19,   14,   18,   16,

       0        // eod
};

void Messages::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<Messages *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->newMessage((*reinterpret_cast< const MessageEntry(*)>(_a[1]))); break;
        case 1: _t->cleared(); break;
        case 2: _t->addMessage((*reinterpret_cast< MessageType(*)>(_a[1])),(*reinterpret_cast< const QString(*)>(_a[2])),(*reinterpret_cast< uint32_t(*)>(_a[3]))); break;
        case 3: _t->addMessage((*reinterpret_cast< MessageType(*)>(_a[1])),(*reinterpret_cast< const QString(*)>(_a[2]))); break;
        case 4: _t->clear(); break;
        case 5: _t->removedFilter((*reinterpret_cast< uint32_t(*)>(_a[1])),(*reinterpret_cast< uint8_t(*)>(_a[2]))); break;
        case 6: _t->addedFilter((*reinterpret_cast< uint32_t(*)>(_a[1])),(*reinterpret_cast< uint8_t(*)>(_a[2])),(*reinterpret_cast< const MessageFilter(*)>(_a[3]))); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (Messages::*)(const MessageEntry & );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Messages::newMessage)) {
                *result = 0;
                return;
            }
        }
        {
            using _t = void (Messages::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Messages::cleared)) {
                *result = 1;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject Messages::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_Messages.data,
    qt_meta_data_Messages,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *Messages::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *Messages::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_Messages.stringdata0))
        return static_cast<void*>(this);
    return QObject::qt_metacast(_clname);
}

int Messages::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 7)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 7;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 7)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 7;
    }
    return _id;
}

// SIGNAL 0
void Messages::newMessage(const MessageEntry & _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}

// SIGNAL 1
void Messages::cleared()
{
    QMetaObject::activate(this, &staticMetaObject, 1, nullptr);
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
