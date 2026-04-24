/****************************************************************************
** Meta object code from reading C++ file 'messageshell.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/messageshell.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'messageshell.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_MessageShell_t {
    QByteArrayData data[85];
    char stringdata0[878];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_MessageShell_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_MessageShell_t qt_meta_stringdata_MessageShell = {
    {
QT_MOC_LITERAL(0, 0, 12), // "MessageShell"
QT_MOC_LITERAL(1, 13, 14), // "channelMessage"
QT_MOC_LITERAL(2, 28, 0), // ""
QT_MOC_LITERAL(3, 29, 14), // "const uint8_t*"
QT_MOC_LITERAL(4, 44, 4), // "cmsg"
QT_MOC_LITERAL(5, 49, 6), // "size_t"
QT_MOC_LITERAL(6, 56, 7), // "uint8_t"
QT_MOC_LITERAL(7, 64, 16), // "formattedMessage"
QT_MOC_LITERAL(8, 81, 13), // "simpleMessage"
QT_MOC_LITERAL(9, 95, 14), // "specialMessage"
QT_MOC_LITERAL(10, 110, 4), // "smsg"
QT_MOC_LITERAL(11, 115, 9), // "guildMOTD"
QT_MOC_LITERAL(12, 125, 5), // "gmotd"
QT_MOC_LITERAL(13, 131, 7), // "consent"
QT_MOC_LITERAL(14, 139, 13), // "moneyOnCorpse"
QT_MOC_LITERAL(15, 153, 5), // "money"
QT_MOC_LITERAL(16, 159, 11), // "moneyUpdate"
QT_MOC_LITERAL(17, 171, 10), // "moneyThing"
QT_MOC_LITERAL(18, 182, 13), // "randomRequest"
QT_MOC_LITERAL(19, 196, 5), // "randr"
QT_MOC_LITERAL(20, 202, 6), // "random"
QT_MOC_LITERAL(21, 209, 9), // "emoteText"
QT_MOC_LITERAL(22, 219, 9), // "emotetext"
QT_MOC_LITERAL(23, 229, 11), // "inspectData"
QT_MOC_LITERAL(24, 241, 5), // "inspt"
QT_MOC_LITERAL(25, 247, 6), // "logOut"
QT_MOC_LITERAL(26, 254, 15), // "zoneEntryClient"
QT_MOC_LITERAL(27, 270, 28), // "const ClientZoneEntryStruct*"
QT_MOC_LITERAL(28, 299, 7), // "zsentry"
QT_MOC_LITERAL(29, 307, 7), // "zoneNew"
QT_MOC_LITERAL(30, 315, 11), // "zoneChanged"
QT_MOC_LITERAL(31, 327, 23), // "const zoneChangeStruct*"
QT_MOC_LITERAL(32, 351, 9), // "zoneBegin"
QT_MOC_LITERAL(33, 361, 13), // "shortZoneName"
QT_MOC_LITERAL(34, 375, 7), // "zoneEnd"
QT_MOC_LITERAL(35, 383, 12), // "longZoneName"
QT_MOC_LITERAL(36, 396, 9), // "worldMOTD"
QT_MOC_LITERAL(37, 406, 4), // "motd"
QT_MOC_LITERAL(38, 411, 11), // "handleSpell"
QT_MOC_LITERAL(39, 423, 3), // "mem"
QT_MOC_LITERAL(40, 427, 9), // "beginCast"
QT_MOC_LITERAL(41, 437, 5), // "bcast"
QT_MOC_LITERAL(42, 443, 10), // "spellFaded"
QT_MOC_LITERAL(43, 454, 2), // "sf"
QT_MOC_LITERAL(44, 457, 18), // "interruptSpellCast"
QT_MOC_LITERAL(45, 476, 5), // "icast"
QT_MOC_LITERAL(46, 482, 9), // "startCast"
QT_MOC_LITERAL(47, 492, 4), // "cast"
QT_MOC_LITERAL(48, 497, 11), // "groupUpdate"
QT_MOC_LITERAL(49, 509, 4), // "gmem"
QT_MOC_LITERAL(50, 514, 11), // "groupInvite"
QT_MOC_LITERAL(51, 526, 12), // "groupDecline"
QT_MOC_LITERAL(52, 539, 11), // "groupFollow"
QT_MOC_LITERAL(53, 551, 12), // "groupDisband"
QT_MOC_LITERAL(54, 564, 17), // "groupLeaderChange"
QT_MOC_LITERAL(55, 582, 12), // "syncDateTime"
QT_MOC_LITERAL(56, 595, 6), // "player"
QT_MOC_LITERAL(57, 602, 24), // "const charProfileStruct*"
QT_MOC_LITERAL(58, 627, 13), // "increaseSkill"
QT_MOC_LITERAL(59, 641, 4), // "data"
QT_MOC_LITERAL(60, 646, 11), // "updateLevel"
QT_MOC_LITERAL(61, 658, 11), // "consMessage"
QT_MOC_LITERAL(62, 670, 3), // "dir"
QT_MOC_LITERAL(63, 674, 6), // "setExp"
QT_MOC_LITERAL(64, 681, 8), // "uint32_t"
QT_MOC_LITERAL(65, 690, 8), // "totalExp"
QT_MOC_LITERAL(66, 699, 9), // "totalTick"
QT_MOC_LITERAL(67, 709, 11), // "minExpLevel"
QT_MOC_LITERAL(68, 721, 11), // "maxExpLevel"
QT_MOC_LITERAL(69, 733, 12), // "tickExpLevel"
QT_MOC_LITERAL(70, 746, 6), // "newExp"
QT_MOC_LITERAL(71, 753, 9), // "setAltExp"
QT_MOC_LITERAL(72, 763, 6), // "maxExp"
QT_MOC_LITERAL(73, 770, 7), // "tickExp"
QT_MOC_LITERAL(74, 778, 8), // "aapoints"
QT_MOC_LITERAL(75, 787, 9), // "newAltExp"
QT_MOC_LITERAL(76, 797, 7), // "addItem"
QT_MOC_LITERAL(77, 805, 11), // "const Item*"
QT_MOC_LITERAL(78, 817, 4), // "item"
QT_MOC_LITERAL(79, 822, 7), // "delItem"
QT_MOC_LITERAL(80, 830, 9), // "killSpawn"
QT_MOC_LITERAL(81, 840, 13), // "filterMessage"
QT_MOC_LITERAL(82, 854, 6), // "prefix"
QT_MOC_LITERAL(83, 861, 11), // "MessageType"
QT_MOC_LITERAL(84, 873, 4) // "type"

    },
    "MessageShell\0channelMessage\0\0"
    "const uint8_t*\0cmsg\0size_t\0uint8_t\0"
    "formattedMessage\0simpleMessage\0"
    "specialMessage\0smsg\0guildMOTD\0gmotd\0"
    "consent\0moneyOnCorpse\0money\0moneyUpdate\0"
    "moneyThing\0randomRequest\0randr\0random\0"
    "emoteText\0emotetext\0inspectData\0inspt\0"
    "logOut\0zoneEntryClient\0"
    "const ClientZoneEntryStruct*\0zsentry\0"
    "zoneNew\0zoneChanged\0const zoneChangeStruct*\0"
    "zoneBegin\0shortZoneName\0zoneEnd\0"
    "longZoneName\0worldMOTD\0motd\0handleSpell\0"
    "mem\0beginCast\0bcast\0spellFaded\0sf\0"
    "interruptSpellCast\0icast\0startCast\0"
    "cast\0groupUpdate\0gmem\0groupInvite\0"
    "groupDecline\0groupFollow\0groupDisband\0"
    "groupLeaderChange\0syncDateTime\0player\0"
    "const charProfileStruct*\0increaseSkill\0"
    "data\0updateLevel\0consMessage\0dir\0"
    "setExp\0uint32_t\0totalExp\0totalTick\0"
    "minExpLevel\0maxExpLevel\0tickExpLevel\0"
    "newExp\0setAltExp\0maxExp\0tickExp\0"
    "aapoints\0newAltExp\0addItem\0const Item*\0"
    "item\0delItem\0killSpawn\0filterMessage\0"
    "prefix\0MessageType\0type"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_MessageShell[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
      45,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // slots: name, argc, parameters, tag, flags
       1,    3,  239,    2, 0x0a /* Public */,
       7,    3,  246,    2, 0x0a /* Public */,
       8,    3,  253,    2, 0x0a /* Public */,
       9,    3,  260,    2, 0x0a /* Public */,
      11,    3,  267,    2, 0x0a /* Public */,
      13,    3,  274,    2, 0x0a /* Public */,
      14,    1,  281,    2, 0x0a /* Public */,
      16,    1,  284,    2, 0x0a /* Public */,
      17,    1,  287,    2, 0x0a /* Public */,
      18,    1,  290,    2, 0x0a /* Public */,
      20,    1,  293,    2, 0x0a /* Public */,
      21,    1,  296,    2, 0x0a /* Public */,
      23,    1,  299,    2, 0x0a /* Public */,
      25,    3,  302,    2, 0x0a /* Public */,
      26,    1,  309,    2, 0x0a /* Public */,
      29,    3,  312,    2, 0x0a /* Public */,
      30,    3,  319,    2, 0x0a /* Public */,
      32,    1,  326,    2, 0x0a /* Public */,
      34,    2,  329,    2, 0x0a /* Public */,
      30,    1,  334,    2, 0x0a /* Public */,
      36,    1,  337,    2, 0x0a /* Public */,
      38,    3,  340,    2, 0x0a /* Public */,
      40,    1,  347,    2, 0x0a /* Public */,
      42,    1,  350,    2, 0x0a /* Public */,
      44,    1,  353,    2, 0x0a /* Public */,
      46,    1,  356,    2, 0x0a /* Public */,
      48,    3,  359,    2, 0x0a /* Public */,
      50,    3,  366,    2, 0x0a /* Public */,
      51,    1,  373,    2, 0x0a /* Public */,
      52,    1,  376,    2, 0x0a /* Public */,
      53,    1,  379,    2, 0x0a /* Public */,
      54,    1,  382,    2, 0x0a /* Public */,
      55,    1,  385,    2, 0x0a /* Public */,
      56,    1,  388,    2, 0x0a /* Public */,
      58,    1,  391,    2, 0x0a /* Public */,
      60,    1,  394,    2, 0x0a /* Public */,
      61,    3,  397,    2, 0x0a /* Public */,
      63,    5,  404,    2, 0x0a /* Public */,
      70,    6,  415,    2, 0x0a /* Public */,
      71,    4,  428,    2, 0x0a /* Public */,
      75,    6,  437,    2, 0x0a /* Public */,
      76,    1,  450,    2, 0x0a /* Public */,
      79,    1,  453,    2, 0x0a /* Public */,
      80,    1,  456,    2, 0x0a /* Public */,
      81,    3,  459,    2, 0x0a /* Public */,

 // slots: parameters
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 6,    4,    2,    2,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 6,    4,    2,    2,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 6,    4,    2,    2,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 6,   10,    2,    2,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 6,   12,    2,    2,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 6,   13,    2,    2,
    QMetaType::Void, 0x80000000 | 3,   15,
    QMetaType::Void, 0x80000000 | 3,   15,
    QMetaType::Void, 0x80000000 | 3,   15,
    QMetaType::Void, 0x80000000 | 3,   19,
    QMetaType::Void, 0x80000000 | 3,   19,
    QMetaType::Void, 0x80000000 | 3,   22,
    QMetaType::Void, 0x80000000 | 3,   24,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 6,    2,    2,    2,
    QMetaType::Void, 0x80000000 | 27,   28,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 6,   29,    2,    2,
    QMetaType::Void, 0x80000000 | 31, 0x80000000 | 5, 0x80000000 | 6,    2,    2,    2,
    QMetaType::Void, QMetaType::QString,   33,
    QMetaType::Void, QMetaType::QString, QMetaType::QString,   33,   35,
    QMetaType::Void, QMetaType::QString,   33,
    QMetaType::Void, 0x80000000 | 3,   37,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 6,   39,    2,    2,
    QMetaType::Void, 0x80000000 | 3,   41,
    QMetaType::Void, 0x80000000 | 3,   43,
    QMetaType::Void, 0x80000000 | 3,   45,
    QMetaType::Void, 0x80000000 | 3,   47,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 6,   49,    2,    2,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 6,   49,    2,    2,
    QMetaType::Void, 0x80000000 | 3,   49,
    QMetaType::Void, 0x80000000 | 3,   49,
    QMetaType::Void, 0x80000000 | 3,   49,
    QMetaType::Void, 0x80000000 | 3,   49,
    QMetaType::Void, QMetaType::QDateTime,    2,
    QMetaType::Void, 0x80000000 | 57,   56,
    QMetaType::Void, 0x80000000 | 3,   59,
    QMetaType::Void, 0x80000000 | 3,   59,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 6,   59,    2,   62,
    QMetaType::Void, 0x80000000 | 64, 0x80000000 | 64, 0x80000000 | 64, 0x80000000 | 64, 0x80000000 | 64,   65,   66,   67,   68,   69,
    QMetaType::Void, 0x80000000 | 64, 0x80000000 | 64, 0x80000000 | 64, 0x80000000 | 64, 0x80000000 | 64, 0x80000000 | 64,   70,   65,   66,   67,   68,   69,
    QMetaType::Void, 0x80000000 | 64, 0x80000000 | 64, 0x80000000 | 64, 0x80000000 | 64,   65,   72,   73,   74,
    QMetaType::Void, 0x80000000 | 64, 0x80000000 | 64, 0x80000000 | 64, 0x80000000 | 64, 0x80000000 | 64, 0x80000000 | 64,   70,   65,   66,   72,   73,   74,
    QMetaType::Void, 0x80000000 | 77,   78,
    QMetaType::Void, 0x80000000 | 77,   78,
    QMetaType::Void, 0x80000000 | 77,   78,
    QMetaType::Void, QMetaType::QString, 0x80000000 | 83, 0x80000000 | 77,   82,   84,   78,

       0        // eod
};

void MessageShell::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<MessageShell *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->channelMessage((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 1: _t->formattedMessage((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 2: _t->simpleMessage((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 3: _t->specialMessage((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 4: _t->guildMOTD((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 5: _t->consent((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 6: _t->moneyOnCorpse((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 7: _t->moneyUpdate((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 8: _t->moneyThing((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 9: _t->randomRequest((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 10: _t->random((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 11: _t->emoteText((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 12: _t->inspectData((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 13: _t->logOut((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 14: _t->zoneEntryClient((*reinterpret_cast< const ClientZoneEntryStruct*(*)>(_a[1]))); break;
        case 15: _t->zoneNew((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 16: _t->zoneChanged((*reinterpret_cast< const zoneChangeStruct*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 17: _t->zoneBegin((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 18: _t->zoneEnd((*reinterpret_cast< const QString(*)>(_a[1])),(*reinterpret_cast< const QString(*)>(_a[2]))); break;
        case 19: _t->zoneChanged((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 20: _t->worldMOTD((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 21: _t->handleSpell((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 22: _t->beginCast((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 23: _t->spellFaded((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 24: _t->interruptSpellCast((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 25: _t->startCast((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 26: _t->groupUpdate((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 27: _t->groupInvite((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 28: _t->groupDecline((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 29: _t->groupFollow((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 30: _t->groupDisband((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 31: _t->groupLeaderChange((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 32: _t->syncDateTime((*reinterpret_cast< const QDateTime(*)>(_a[1]))); break;
        case 33: _t->player((*reinterpret_cast< const charProfileStruct*(*)>(_a[1]))); break;
        case 34: _t->increaseSkill((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 35: _t->updateLevel((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 36: _t->consMessage((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 37: _t->setExp((*reinterpret_cast< uint32_t(*)>(_a[1])),(*reinterpret_cast< uint32_t(*)>(_a[2])),(*reinterpret_cast< uint32_t(*)>(_a[3])),(*reinterpret_cast< uint32_t(*)>(_a[4])),(*reinterpret_cast< uint32_t(*)>(_a[5]))); break;
        case 38: _t->newExp((*reinterpret_cast< uint32_t(*)>(_a[1])),(*reinterpret_cast< uint32_t(*)>(_a[2])),(*reinterpret_cast< uint32_t(*)>(_a[3])),(*reinterpret_cast< uint32_t(*)>(_a[4])),(*reinterpret_cast< uint32_t(*)>(_a[5])),(*reinterpret_cast< uint32_t(*)>(_a[6]))); break;
        case 39: _t->setAltExp((*reinterpret_cast< uint32_t(*)>(_a[1])),(*reinterpret_cast< uint32_t(*)>(_a[2])),(*reinterpret_cast< uint32_t(*)>(_a[3])),(*reinterpret_cast< uint32_t(*)>(_a[4]))); break;
        case 40: _t->newAltExp((*reinterpret_cast< uint32_t(*)>(_a[1])),(*reinterpret_cast< uint32_t(*)>(_a[2])),(*reinterpret_cast< uint32_t(*)>(_a[3])),(*reinterpret_cast< uint32_t(*)>(_a[4])),(*reinterpret_cast< uint32_t(*)>(_a[5])),(*reinterpret_cast< uint32_t(*)>(_a[6]))); break;
        case 41: _t->addItem((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 42: _t->delItem((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 43: _t->killSpawn((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 44: _t->filterMessage((*reinterpret_cast< const QString(*)>(_a[1])),(*reinterpret_cast< MessageType(*)>(_a[2])),(*reinterpret_cast< const Item*(*)>(_a[3]))); break;
        default: ;
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject MessageShell::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_MessageShell.data,
    qt_meta_data_MessageShell,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *MessageShell::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *MessageShell::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_MessageShell.stringdata0))
        return static_cast<void*>(this);
    return QObject::qt_metacast(_clname);
}

int MessageShell::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 45)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 45;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 45)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 45;
    }
    return _id;
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
