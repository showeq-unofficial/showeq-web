/****************************************************************************
** Meta object code from reading C++ file 'guildshell.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/guildshell.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'guildshell.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_GuildShell_t {
    QByteArrayData data[15];
    char stringdata0[136];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_GuildShell_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_GuildShell_t qt_meta_stringdata_GuildShell = {
    {
QT_MOC_LITERAL(0, 0, 10), // "GuildShell"
QT_MOC_LITERAL(1, 11, 7), // "cleared"
QT_MOC_LITERAL(2, 19, 0), // ""
QT_MOC_LITERAL(3, 20, 6), // "loaded"
QT_MOC_LITERAL(4, 27, 5), // "added"
QT_MOC_LITERAL(5, 33, 18), // "const GuildMember*"
QT_MOC_LITERAL(6, 52, 2), // "gm"
QT_MOC_LITERAL(7, 55, 7), // "removed"
QT_MOC_LITERAL(8, 63, 7), // "updated"
QT_MOC_LITERAL(9, 71, 15), // "guildMemberList"
QT_MOC_LITERAL(10, 87, 14), // "const uint8_t*"
QT_MOC_LITERAL(11, 102, 4), // "data"
QT_MOC_LITERAL(12, 107, 6), // "size_t"
QT_MOC_LITERAL(13, 114, 3), // "len"
QT_MOC_LITERAL(14, 118, 17) // "guildMemberUpdate"

    },
    "GuildShell\0cleared\0\0loaded\0added\0"
    "const GuildMember*\0gm\0removed\0updated\0"
    "guildMemberList\0const uint8_t*\0data\0"
    "size_t\0len\0guildMemberUpdate"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_GuildShell[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
       7,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       5,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    0,   49,    2, 0x06 /* Public */,
       3,    0,   50,    2, 0x06 /* Public */,
       4,    1,   51,    2, 0x06 /* Public */,
       7,    1,   54,    2, 0x06 /* Public */,
       8,    1,   57,    2, 0x06 /* Public */,

 // slots: name, argc, parameters, tag, flags
       9,    2,   60,    2, 0x0a /* Public */,
      14,    2,   65,    2, 0x0a /* Public */,

 // signals: parameters
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 5,    6,
    QMetaType::Void, 0x80000000 | 5,    6,
    QMetaType::Void, 0x80000000 | 5,    6,

 // slots: parameters
    QMetaType::Void, 0x80000000 | 10, 0x80000000 | 12,   11,   13,
    QMetaType::Void, 0x80000000 | 10, 0x80000000 | 12,   11,   13,

       0        // eod
};

void GuildShell::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<GuildShell *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->cleared(); break;
        case 1: _t->loaded(); break;
        case 2: _t->added((*reinterpret_cast< const GuildMember*(*)>(_a[1]))); break;
        case 3: _t->removed((*reinterpret_cast< const GuildMember*(*)>(_a[1]))); break;
        case 4: _t->updated((*reinterpret_cast< const GuildMember*(*)>(_a[1]))); break;
        case 5: _t->guildMemberList((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2]))); break;
        case 6: _t->guildMemberUpdate((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2]))); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (GuildShell::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&GuildShell::cleared)) {
                *result = 0;
                return;
            }
        }
        {
            using _t = void (GuildShell::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&GuildShell::loaded)) {
                *result = 1;
                return;
            }
        }
        {
            using _t = void (GuildShell::*)(const GuildMember * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&GuildShell::added)) {
                *result = 2;
                return;
            }
        }
        {
            using _t = void (GuildShell::*)(const GuildMember * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&GuildShell::removed)) {
                *result = 3;
                return;
            }
        }
        {
            using _t = void (GuildShell::*)(const GuildMember * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&GuildShell::updated)) {
                *result = 4;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject GuildShell::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_GuildShell.data,
    qt_meta_data_GuildShell,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *GuildShell::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *GuildShell::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_GuildShell.stringdata0))
        return static_cast<void*>(this);
    return QObject::qt_metacast(_clname);
}

int GuildShell::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
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
void GuildShell::cleared()
{
    QMetaObject::activate(this, &staticMetaObject, 0, nullptr);
}

// SIGNAL 1
void GuildShell::loaded()
{
    QMetaObject::activate(this, &staticMetaObject, 1, nullptr);
}

// SIGNAL 2
void GuildShell::added(const GuildMember * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 2, _a);
}

// SIGNAL 3
void GuildShell::removed(const GuildMember * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 3, _a);
}

// SIGNAL 4
void GuildShell::updated(const GuildMember * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 4, _a);
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
