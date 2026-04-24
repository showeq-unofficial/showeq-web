/****************************************************************************
** Meta object code from reading C++ file 'group.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/group.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'group.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_GroupMgr_t {
    QByteArrayData data[25];
    char stringdata0[232];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_GroupMgr_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_GroupMgr_t qt_meta_stringdata_GroupMgr = {
    {
QT_MOC_LITERAL(0, 0, 8), // "GroupMgr"
QT_MOC_LITERAL(1, 9, 5), // "added"
QT_MOC_LITERAL(2, 15, 0), // ""
QT_MOC_LITERAL(3, 16, 4), // "name"
QT_MOC_LITERAL(4, 21, 12), // "const Spawn*"
QT_MOC_LITERAL(5, 34, 3), // "mem"
QT_MOC_LITERAL(6, 38, 7), // "removed"
QT_MOC_LITERAL(7, 46, 7), // "cleared"
QT_MOC_LITERAL(8, 54, 6), // "player"
QT_MOC_LITERAL(9, 61, 24), // "const charProfileStruct*"
QT_MOC_LITERAL(10, 86, 11), // "groupUpdate"
QT_MOC_LITERAL(11, 98, 14), // "const uint8_t*"
QT_MOC_LITERAL(12, 113, 4), // "data"
QT_MOC_LITERAL(13, 118, 6), // "size_t"
QT_MOC_LITERAL(14, 125, 4), // "size"
QT_MOC_LITERAL(15, 130, 14), // "addGroupMember"
QT_MOC_LITERAL(16, 145, 17), // "removeGroupMember"
QT_MOC_LITERAL(17, 163, 7), // "addItem"
QT_MOC_LITERAL(18, 171, 11), // "const Item*"
QT_MOC_LITERAL(19, 183, 4), // "item"
QT_MOC_LITERAL(20, 188, 7), // "delItem"
QT_MOC_LITERAL(21, 196, 9), // "killSpawn"
QT_MOC_LITERAL(22, 206, 8), // "dumpInfo"
QT_MOC_LITERAL(23, 215, 12), // "QTextStream&"
QT_MOC_LITERAL(24, 228, 3) // "out"

    },
    "GroupMgr\0added\0\0name\0const Spawn*\0mem\0"
    "removed\0cleared\0player\0const charProfileStruct*\0"
    "groupUpdate\0const uint8_t*\0data\0size_t\0"
    "size\0addGroupMember\0removeGroupMember\0"
    "addItem\0const Item*\0item\0delItem\0"
    "killSpawn\0dumpInfo\0QTextStream&\0out"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_GroupMgr[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
      11,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       3,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    2,   69,    2, 0x06 /* Public */,
       6,    2,   74,    2, 0x06 /* Public */,
       7,    0,   79,    2, 0x06 /* Public */,

 // slots: name, argc, parameters, tag, flags
       8,    1,   80,    2, 0x0a /* Public */,
      10,    2,   83,    2, 0x0a /* Public */,
      15,    1,   88,    2, 0x0a /* Public */,
      16,    1,   91,    2, 0x0a /* Public */,
      17,    1,   94,    2, 0x0a /* Public */,
      20,    1,   97,    2, 0x0a /* Public */,
      21,    1,  100,    2, 0x0a /* Public */,
      22,    1,  103,    2, 0x0a /* Public */,

 // signals: parameters
    QMetaType::Void, QMetaType::QString, 0x80000000 | 4,    3,    5,
    QMetaType::Void, QMetaType::QString, 0x80000000 | 4,    3,    5,
    QMetaType::Void,

 // slots: parameters
    QMetaType::Void, 0x80000000 | 9,    8,
    QMetaType::Void, 0x80000000 | 11, 0x80000000 | 13,   12,   14,
    QMetaType::Void, 0x80000000 | 11,   12,
    QMetaType::Void, 0x80000000 | 11,   12,
    QMetaType::Void, 0x80000000 | 18,   19,
    QMetaType::Void, 0x80000000 | 18,   19,
    QMetaType::Void, 0x80000000 | 18,   19,
    QMetaType::Void, 0x80000000 | 23,   24,

       0        // eod
};

void GroupMgr::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<GroupMgr *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->added((*reinterpret_cast< const QString(*)>(_a[1])),(*reinterpret_cast< const Spawn*(*)>(_a[2]))); break;
        case 1: _t->removed((*reinterpret_cast< const QString(*)>(_a[1])),(*reinterpret_cast< const Spawn*(*)>(_a[2]))); break;
        case 2: _t->cleared(); break;
        case 3: _t->player((*reinterpret_cast< const charProfileStruct*(*)>(_a[1]))); break;
        case 4: _t->groupUpdate((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2]))); break;
        case 5: _t->addGroupMember((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 6: _t->removeGroupMember((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 7: _t->addItem((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 8: _t->delItem((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 9: _t->killSpawn((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 10: _t->dumpInfo((*reinterpret_cast< QTextStream(*)>(_a[1]))); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (GroupMgr::*)(const QString & , const Spawn * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&GroupMgr::added)) {
                *result = 0;
                return;
            }
        }
        {
            using _t = void (GroupMgr::*)(const QString & , const Spawn * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&GroupMgr::removed)) {
                *result = 1;
                return;
            }
        }
        {
            using _t = void (GroupMgr::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&GroupMgr::cleared)) {
                *result = 2;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject GroupMgr::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_GroupMgr.data,
    qt_meta_data_GroupMgr,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *GroupMgr::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *GroupMgr::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_GroupMgr.stringdata0))
        return static_cast<void*>(this);
    return QObject::qt_metacast(_clname);
}

int GroupMgr::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
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
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 11;
    }
    return _id;
}

// SIGNAL 0
void GroupMgr::added(const QString & _t1, const Spawn * _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}

// SIGNAL 1
void GroupMgr::removed(const QString & _t1, const Spawn * _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 1, _a);
}

// SIGNAL 2
void GroupMgr::cleared()
{
    QMetaObject::activate(this, &staticMetaObject, 2, nullptr);
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
